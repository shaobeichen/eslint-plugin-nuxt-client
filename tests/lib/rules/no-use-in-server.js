/**
 * @fileoverview Do not use client variables on the server
 * @author shaobeichen
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-use-in-server')

const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-use-in-server', rule, {
  valid: [
    // give me some code that won't trigger a warning
    // {
    //   filename: 'test.vue',
    //   code: `
    //       export default {
    //         created() {
    //           const path = this.$route.path
    //         },
    //         beforeCreate() {
    //           const path = this.$route.params.foo
    //         }
    //       }
    //     `,
    //   parserOptions,
    // },
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
          export default {
            created() {
              const path = window.location.pathname
            },
            beforeCreate() {
              const foo = document.foo
            }
          }
        `,
      errors: [
        {
          message: 'Unexpected window in created.',
          type: 'MemberExpression',
        },
        {
          message: 'Unexpected document in beforeCreate.',
          type: 'MemberExpression',
        },
      ],
      parserOptions,
    },
    // {
    //   filename: 'test.vue',
    //   code: `
    //       export default {
    //         created() {
    //           document.foo = 'bar'
    //         },
    //         beforeCreate() {
    //           window.foo = 'bar'
    //         }
    //       }
    //     `,
    //   errors: [
    //     {
    //       message: 'Unexpected document in created.',
    //       type: 'MemberExpression',
    //     },
    //     {
    //       message: 'Unexpected window in beforeCreate.',
    //       type: 'MemberExpression',
    //     },
    //   ],
    //   parserOptions,
    // },
  ],
})
