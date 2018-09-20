const baseWebpackConfig = require('./base.config')

const clientWebpackConfig = {
  ...baseWebpackConfig,

  // Replace `entry` to only include `client-bundle`
  entry: {
    'client-bundle': baseWebpackConfig.entry['client-bundle'],
  },
}

module.exports = clientWebpackConfig
