const baseWebpackConfig = require('./base.config')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const serverWebpackConfig = {
  ...baseWebpackConfig,

  // Replace `entry` to only include `server-bundle`
  entry: {
    'server-bundle': baseWebpackConfig.entry['server-bundle'],
  },

  // Append `HardSourceWebpackPlugin` to plugins
  plugins: [...baseWebpackConfig.plugins, new HardSourceWebpackPlugin()],
}

module.exports = serverWebpackConfig
