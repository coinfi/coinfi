const ExtractTextPlugin = require('extract-text-webpack-plugin')
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
const devBuild = process.env.NODE_ENV !== 'production'

if (devBuild) {
  console.log('Webpack dev build for Rails') // eslint-disable-line no-console
} else {
  console.log('Webpack production build for Rails') // eslint-disable-line no-console
}

module.exports = {
  ...baseConfig,

  devtool: devBuild ? 'eval-source-map' : baseConfig.devBuild,

  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    publicPath: railsWebpackConfig.output.publicPath,
    path: railsWebpackConfig.output.path,
  },

  // See webpack.client.base.config for adding modules common to both webpack dev server and rails

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
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
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
        }),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
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
        }),
      },
      {
        test: require.resolve('react'),
        use: {
          loader: 'imports-loader',
          options: {
            shim: 'es5-shim/es5-shim',
            sham: 'es5-shim/es5-sham',
          },
        },
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
    new ExtractTextPlugin({
      filename: '[name]-[hash].css',
      allChunks: true,
    }),
  ],
}
