const baseWebpackConfig = require('./base.config')
const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const clientWebpackConfig = {
  ...baseWebpackConfig,

  // Replace `entry` to only include `client-bundle`
  entry: {
    'client-bundle': baseWebpackConfig.entry['client-bundle'],
  },

  // Append `HardSourceWebpackPlugin` to plugins
  plugins: [...baseWebpackConfig.plugins, new HardSourceWebpackPlugin()],
}

module.exports = clientWebpackConfig
