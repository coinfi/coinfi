const clientWebpackConfig = require('./config/client.config')
const serverWebpackConfig = require('./config/server.config.dev')

// Include both server and client config for webpack to build
module.exports = [serverWebpackConfig, clientWebpackConfig]
