// Common client-side webpack configuration used by webpack.hot.config and webpack.rails.config.
const { resolve } = require('path')
const { paths } = require(resolve(
  process.env.PROJECT_PATH,
  'client/config/lib/constants',
))
const webpack = require('webpack')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader')
const { environment } = require('@rails/webpacker')

const railsWebpackConfig = webpackConfigLoader(paths.railsConfig)
const devBuild = process.env.NODE_ENV !== 'production'

module.exports = {
  // the project dir
  context: paths.webpack.src,
  entry: {
    // This will contain the app entry points defined by
    // webpack.client.rails.hot.config and webpack.client.rails.build.config

    'vendor-bundle': [
      'es5-shim/es5-shim',
      'es5-shim/es5-sham',
      'jquery',
      'jquery-serializejson',
    ],

    // This will contain the app entry points defined by webpack.hot.config and webpack.rails.config
    'app-bundle': [
      resolve(paths.webpack.src, 'modules/navigation.js'),
      paths.webpack.clientEntry,
    ],
  },

  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.sass',
      '.scss',
      '.css',
      '.module.sass',
      '.module.scss',
      '.module.css',
      '.png',
      '.svg',
      '.gif',
      '.jpeg',
      '.jpg',
    ],
    modules: ['node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false,
    }),
    new WebpackAssetsManifest({
      entrypoints: true,
      writeToDisk: true,
      publicPath: railsWebpackConfig.output.publicPath,
    }),
  ],

  // https://github.com/rails/webpacker/blob/2a7e298fd6a32ccd1d22d7d260539da8f87ce814/package/environments/base.js#L131
  optimization: {
    // Split vendor and common chunks
    // https://twitter.com/wSokra/status/969633336732905474
    splitChunks: {
      chunks: 'all',
      name: true,
    },
    // Separate runtime chunk to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },

  module: {
    rules: [
      {
        test: /\.(ttf|eot)$/,
        use: 'file-loader',
      },
      {
        test: /\.(woff2?|jpe?g|png|gif|svg|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash].[ext]',
            limit: 10000,
          },
        },
      },
      environment.loaders.get('css'),
      environment.loaders.get('sass'),
      environment.loaders.get('moduleCss'),
      environment.loaders.get('moduleSass'),
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            query: 'jQuery',
          },
          {
            loader: 'expose-loader',
            query: '$',
          },
        ],
      },
    ],
  },

  watchOptions: {
    ignored: /node_modules/,
    poll: 5000,
    aggregateTimeout: 300,
  },
}
