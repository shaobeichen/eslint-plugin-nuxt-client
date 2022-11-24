/**
 * @fileoverview disallow use client variables in computed hooks
 * @author shaobeichen
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow `window/document` in `created/beforeCreate`',
      category: null,
    },
    messages: {
      noGlobals: 'Unexpected {{name}} in {{funcName}}.',
    },
    schema: [{}],
  },

  create(context) {
    const forbiddenNodes = []
    const options = context.options[0] || {}

    const HOOKS = new Set(['created', 'beforeCreate'].concat(options.methods || []))
    const GLOBALS = ['window', 'document']

    function isGlobals(name) {
      return GLOBALS.includes(name)
    }

    return {
      MemberExpression(node) {
        if (!node.object) return

        const name = node.object.name

        if (isGlobals(name)) {
          forbiddenNodes.push({ name, node })
        }
      },
      VariableDeclarator(node) {
        if (!node.init) return

        const name = node.init.name

        if (isGlobals(name)) {
          forbiddenNodes.push({ name, node })
        }
      },
      ...utils.executeOnVue(context, (obj) => {
        for (const { funcName, name, node } of utils.getFunctionWithChild(
          obj,
          HOOKS,
          forbiddenNodes,
        )) {
          console.warn(111, funcName, name, node)
          context.report({
            node,
            messageId: 'noGlobals',
            data: {
              name,
              funcName,
            },
          })
        }
      }),
    }
  },
}
