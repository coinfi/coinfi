const baseWebpackConfig = require('./server.config.base')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

const serverWebpackConfig = {
  ...baseWebpackConfig,

  // Add `WriteFilePlugin` plugin
  plugins: [...baseWebpackConfig.plugins, new WriteFilePlugin()],
}

module.exports = serverWebpackConfig
