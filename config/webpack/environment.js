/*
  Info for this file can be found at:
  https://github.com/rails/webpacker/blob/master/docs/webpack.md
  https://stackoverflow.com/questions/45998003/how-to-use-jquery-with-rails-webpacker-3
*/

const { environment } = require('@rails/webpacker')
const merge = require('webpack-merge')
const webpack = require('webpack')
const dotenv = require('dotenv')

/*
 * Provide dotenv
 */

const dotenvFiles = [
  `.env.${process.env.NODE_ENV}.local`,
  '.env.local',
  `.env.${process.env.NODE_ENV}`,
  '.env'
]
dotenvFiles.forEach(dotenvFile => {
  dotenv.config({ path: dotenvFile, silent: true })
})

environment.plugins.prepend(
  'Environment',
  new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(process.env)))
)

/*
 * Provide jQuery
 */

environment.plugins.prepend(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    JQuery: 'jquery',
    jquery: 'jquery'
    // ActionCable: 'actioncable', // Could be useful
  })
)

const envConfig = (module.exports = environment)
const aliasConfig = (module.exports = {
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery'
    }
  }
})

module.exports = merge(envConfig.toWebpackConfig(), aliasConfig)
