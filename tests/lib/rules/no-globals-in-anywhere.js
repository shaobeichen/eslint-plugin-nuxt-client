const rule = require('../../../lib/rules/no-globals-in-anywhere')
const { RuleTester } = require('eslint')

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
}

const parser = require.resolve('vue-eslint-parser')

const ruleTester = new RuleTester({
  parser,
  parserOptions,
})

ruleTester.run('no-globals-in-anywhere', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `
          export default {
            b: process.client && window.b
          } 
              `,
      parserOptions,
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
            data() {
                return {
                    b: process.client && window.b
                }
            },
        }
        </script>
            `,
      parserOptions,
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
        data() {
            return {
                a: window.a,
            }
        },
        methods: {
            a() {
                console.log(location.href)
            },
        },
        }
        </script>
              `,
      errors: [
        {
          message: 'window maybe used on server, resulting in errors.',
          line: 6,
        },
        {
          message: 'location maybe used on server, resulting in errors.',
          line: 11,
        },
      ],
    },
  ],
})
