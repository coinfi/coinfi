const baseWebpackConfig = require('./base.config')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const serverWebpackConfig = {
  ...baseWebpackConfig,

  // Replace `entry` to only include `server-bundle`
  entry: {
    'server-bundle': baseWebpackConfig.entry['server-bundle'],
  },

  // Include additional plugins
  plugins: [...baseWebpackConfig.plugins, new HardSourceWebpackPlugin()],
}

module.exports = serverWebpackConfig
