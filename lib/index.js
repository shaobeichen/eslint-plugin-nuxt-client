module.exports = {
  rules: {
    'no-globals-in-server': require('./rules/no-globals-in-server'),
    'no-globals-in-anywhere': require('./rules/no-globals-in-anywhere'),
  },
  configs: {
    base: require('./configs/base'),
    recommended: require('./configs/recommended'),
  },
  processors: {
    '.vue': require('./processors'),
  },
}
