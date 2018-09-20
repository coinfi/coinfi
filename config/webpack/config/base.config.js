/*
  Info for this file can be found at:
  https://github.com/rails/webpacker/blob/master/docs/webpack.md
  https://stackoverflow.com/questions/45998003/how-to-use-jquery-with-rails-webpacker-3
*/

const { environment, config } = require('@rails/webpacker')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const typescript = require('./loaders/typescript')
const merge = require('webpack-merge')
const webpack = require('webpack')
const dotenv = require('dotenv')
const path = require('path')
const _ = require('lodash')

/*
 * Provide dotenv
 */

const dotenvFiles = [
  `.env.${process.env.NODE_ENV}.local`,
  '.env.local',
  `.env.${process.env.NODE_ENV}`,
  '.env',
]
dotenvFiles.forEach((dotenvFile) => {
  dotenv.config({ path: dotenvFile, silent: true })
})

environment.plugins.prepend(
  'Environment',
  new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(process.env))),
)

/*
 * Provide jQuery
 */

environment.plugins.prepend(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    JQuery: 'jquery',
    jquery: 'jquery',
    // ActionCable: 'actioncable', // Could be useful
  }),
)

environment.loaders.append('typescript', typescript)

const aliasConfig = {
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery',
    },
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
  },
}

module.exports = merge(environment.toWebpackConfig(), aliasConfig)
