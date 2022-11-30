const rule = require('../../../lib/rules/no-globals-in-server')
const { RuleTester } = require('eslint')

const parser = require.resolve('vue-eslint-parser')

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
}

const ruleTester = new RuleTester({
  parser,
  parserOptions,
})

ruleTester.run('no-globals-in-server', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
        computed: {
            name() {
                return process.client && window.b
            },
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
          computed: {
            foo() {
                window.a = 1
                return 2
            }
          },
          created() {
            console.log(window.b)
          },
          beforeCreate() {
            console.log(location)
          },
        }
      </script>
              `,
      errors: [
        {
          message: 'window in computed maybe cause error.',
          line: 6,
        },
        {
          message: 'window in created maybe cause error.',
          line: 11,
        },
        {
          message: 'location in beforeCreate maybe cause error.',
          line: 14,
        },
      ],
    },
  ],
})
