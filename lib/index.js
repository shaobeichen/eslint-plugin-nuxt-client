module.exports = {
  rules: {
    'no-use-in-server': require('./rules/no-use-in-server'),
  },
  configs: {
    base: require('./configs/base'),
  },
  processors: {
    '.vue': require('./processors'),
  },
}
