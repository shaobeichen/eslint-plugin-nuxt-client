const { isClientGlobals, inSSRHook } = require('../utils/index')
const utils = require('eslint-plugin-vue/lib/utils')

module.exports = {
  meta: {
    docs: {
      description: 'browser api in ssr hook may be cause error.',
      category: 'recommended',
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: '',
  },
  create,
}

function create(context) {
  return utils.compositingVisitors(
    {
      Program() {
        const scope = context.getScope()
        console.warn(scope.type)

        scope.through.forEach((reference) => {
          if (isClientGlobals(reference.identifier.name)) {
            const { hook, node: parent } = inSSRHook(reference.identifier)
            if (parent && hook) {
              context.report({
                node: reference.identifier,
                // eslint-disable-next-line eslint-plugin/prefer-message-ids
                message: '{{ name }} in {{ hook }} maybe cause ssr error.',
                data: {
                  name: reference.identifier.name,
                  hook,
                },
              })
            }
          }
        })
      },
    },
    utils.isScriptSetup(context)
      ? utils.defineScriptSetupVisitor(context, {})
      : utils.defineVueVisitor(context, {}),
  )
}
