const baseWebpackConfig = require('./base.config')

const serverWebpackConfig = {
  ...baseWebpackConfig,

  // Replace `entry` to only include `server-bundle`
  entry: {
    'server-bundle': baseWebpackConfig.entry['server-bundle'],
  },
}

module.exports = serverWebpackConfig
