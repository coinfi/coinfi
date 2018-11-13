const webpack = require('webpack')
const { resolve } = require('path')
const { paths } = require(resolve(
  process.env.PROJECT_PATH,
  'client/config/lib/constants',
))
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader')

const baseConfig = require(resolve(
  paths.webpack.config,
  'webpack.client.base.config',
))
const railsWebpackConfig = webpackConfigLoader(paths.railsConfig)
const hotReloadingUrl = railsWebpackConfig.output.publicPathWithHost

module.exports = {
  ...baseConfig,

  devtool: 'eval-source-map',

  entry: {
    'app-bundle': [
      ...baseConfig.entry['app-bundle'],
      `webpack-dev-server/client?${hotReloadingUrl}`,
      'webpack/hot/only-dev-server',
    ],

    // These are Rails specific
    'vendor-bundle': [...baseConfig.entry['vendor-bundle'], 'jquery-ujs'],
  },

  output: {
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    publicPath: railsWebpackConfig.output.publicPath,
    path: railsWebpackConfig.output.path,
  },

  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: paths.postcssConfig,
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: paths.postcssConfig,
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: require.resolve('jquery-ujs'),
        use: {
          loader: 'imports-loader',
          options: {
            jQuery: 'jquery',
          },
        },
      },
    ],
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}

console.log('Webpack HOT dev build for Rails') // eslint-disable-line no-console
