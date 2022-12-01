const utils = require('eslint-plugin-vue/lib/utils')
const { browser: browserGlobals, node: nodeGlobals } = require('globals')

/**
 * 判断是否是服务端的hook
 * @param {Property} node
 * @returns {object}
 */
function inServerHook(node) {
  let matchedHook
  const HOOKS = [
    'computed',
    'created',
    'beforeCreate',
    'asyncData',
    'fetch',
    'nuxtServerInit',
    'validate',
    'serverPrefetch',
  ]
  const matchNode = findParentPropertyByMatcher(node, (key) => {
    return (matchedHook = HOOKS.find((hook) => key === hook))
  })
  return {
    node: matchNode,
    hook: matchedHook,
  }
}

/**
 * 判断是否是客户端的hook
 * @param {Property} node
 * @returns {object}
 */
function inClientHook(node) {
  let matchedHook
  const HOOKS = [
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'beforeUnmount',
    'unmounted',
    'errorCaptured',
    'renderTracked',
    'renderTriggered',
    'activated',
    'deactivated',
  ]
  const matchNode = findParentPropertyByMatcher(node, (key) => {
    return (matchedHook = HOOKS.find((hook) => key === hook))
  })
  return {
    node: matchNode,
    hook: matchedHook,
  }
}

/**
 * 循环向上查找符合相应条件的父级节点
 * @param {Property} node 当前节点
 * @param {function} matcher 判断条件
 * @returns {Property}
 */
function findParentPropertyByMatcher(node, matcher) {
  let current = node
  while (current) {
    if (current.type === 'Property' && typeof matcher === 'function' && matcher(current.key.name)) {
      return current
    }
    current = current.parent
  }
  return
}

/**
 * 判断是否是客户端变量，而且是服务端没有的，比如window，document，location
 * 比如setTimeout，两端都有，就不能算
 * @param {string} variable
 * @returns {boolean}
 */
function isClientGlobals(variable) {
  return variable in browserGlobals && !(variable in nodeGlobals)
}

/**
 * 向父级的父级循环查找
 * 在当前节点上一直往外冒泡查找，找到 FunctionExpression 类型就停止
 * 用于查找当前节点所在的函数
 * 举例：
 * export default {
 *   computed: {
 *     name() {
 *       return window.b
 *     }
 *   }
 * }
 * node节点是 window，返回的节点是
 * {
 *   name() {
 *     return window.b
 *   }
 * }
 *
 * @param {Identifier} node
 * @returns {FunctionExpression}
 */
function getParent(node) {
  let parent = node.parent
  while (parent && !(parent.type === 'FunctionExpression')) {
    parent = parent.parent
  }
  return parent
}

module.exports = {
  isClientGlobals,
  findParentPropertyByMatcher,
  inServerHook,
  inClientHook,
  getParent,
  ...utils,
}
