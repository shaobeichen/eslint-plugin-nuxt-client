const { isClientGlobals, inSSRHook, getParent } = require('../utils/index')
const utils = require('eslint-plugin-vue/lib/utils')

module.exports = {
  meta: {
    hasSuggestions: true,
    docs: {
      description: 'browser api in ssr hook may be cause error.',
      category: 'base',
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      clientVariableReport: '{{ name }} in {{ hook }} maybe cause ssr error.',
      addProcessClientSuggest: 'Add`process.client && `',
    },
  },
  create,
}

function create(context) {
  return utils.compositingVisitors(
    {
      Program() {
        const scope = context.getScope()
        const sourceCode = context.getSourceCode()

        scope.through.forEach((reference) => {
          if (isClientGlobals(reference.identifier.name)) {
            const { hook, node: parent } = inSSRHook(reference.identifier)
            const isHaveProcessClient = !!~sourceCode
              .getText(getParent(reference.identifier))
              .indexOf('process.client')

            const hookNode = parent && hook && !isHaveProcessClient
            const noHookNode = !hook

            if (hookNode || noHookNode) {
              context.report({
                node: reference.identifier,
                messageId: 'clientVariableReport',
                data: {
                  name: reference.identifier.name,
                  hook,
                },
                suggest: [
                  {
                    messageId: 'addProcessClientSuggest',
                    fix(fixer) {
                      return fixer.insertTextBefore(reference.identifier, 'process.client && ')
                    },
                  },
                ],
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
