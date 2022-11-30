const {
  isClientGlobals,
  inServerHook,
  getParent,
  compositingVisitors,
  isScriptSetup,
  defineScriptSetupVisitor,
  defineVueVisitor,
} = require('../utils/index')

module.exports = {
  meta: {
    hasSuggestions: true,
    docs: {
      description: 'client api maybe used on server, resulting in errors.',
      category: 'recommended',
    },
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages: {
      clientVariableReport: '{{ name }} maybe used on server, resulting in errors.',
      addProcessClientSuggest: 'Add`process.client && `',
    },
  },
  create,
}

function create(context) {
  return compositingVisitors(
    {
      Program() {
        const scope = context.getScope()
        const sourceCode = context.getSourceCode()

        scope.through.forEach((reference) => {
          if (isClientGlobals(reference.identifier.name)) {
            const { hook } = inServerHook(reference.identifier)
            const isHaveProcessClient = !!~sourceCode
              .getText(getParent(reference.identifier))
              .indexOf('process.client')

            // 不在服务端hook中，并且作用域内没有 process.client 就提示
            const hookNode = !hook && !isHaveProcessClient

            if (hookNode) {
              context.report({
                node: reference.identifier,
                messageId: 'clientVariableReport',
                data: {
                  name: reference.identifier.name,
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
    isScriptSetup(context) ? defineScriptSetupVisitor(context, {}) : defineVueVisitor(context, {}),
  )
}
