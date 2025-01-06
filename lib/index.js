const getFlatConfig = () => ({
  browser: require('./configs/flat/browser'),
})

module.exports = {
  configs: {
    browser: require('./configs/browser'),
    prettier: require('./configs/prettier'),
    recommended: require('./configs/recommended'),
    typescript: require('./configs/typescript'),
    'vue-typescript': require('./configs/vue-typescript'),
    'react-typescript': require('./configs/react-typescript'),
  },
  getFlatConfigs: getFlatConfig,
}
