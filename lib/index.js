const getFlatConfigs = () => ({
  browser: require('./configs/flat/browser'),
  recommended: require('./configs/flat/recommended'),
  typescript: require('./configs/flat/typescript'),
  'react-typescript': require('./configs/flat/react-typescript'),
  'vue-typescript': require('./configs/flat/vue-typescript'),
  prettier: require('./configs/flat/prettier'),
})

module.exports = {
  getFlatConfigs,
}
