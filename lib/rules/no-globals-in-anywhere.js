const {
  isClientGlobals,
  inServerHook,
  inClientHook,
  getParent,
  compositingVisitors,
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
  return compositingVisitors({
    Program() {
      const scope = context.getScope()
      const sourceCode = context.getSourceCode()

      scope.through.forEach((reference) => {
        if (isClientGlobals(reference.identifier.name)) {
          const { hook: clientHook } = inClientHook(reference.identifier)
          const { hook: serverHook } = inServerHook(reference.identifier)
          const isHaveProcessClient = !!~sourceCode
            .getText(getParent(reference.identifier))
            .indexOf('process.client')

          // 不在服务端hook中，并且作用域内没有 process.client 就提示
          const serverHookCondition = !serverHook && !isHaveProcessClient
          // 不在客户端hook中，并且作用域内没有 process.client 就提示
          const clientHookCondition = !clientHook && !isHaveProcessClient

          if (serverHookCondition || clientHookCondition) {
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
  })
}
