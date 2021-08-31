// Common client-side webpack configuration used by webpack.hot.config and webpack.rails.config.
const { resolve } = require('path')
const { paths } = require(resolve(
  process.env.PROJECT_PATH,
  'client/config/lib/constants',
))
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader')

const railsWebpackConfig = webpackConfigLoader(paths.railsConfig)
const devBuild = process.env.NODE_ENV !== 'production'

module.exports = {
  // the project dir
  context: paths.webpack.src,
  entry: {
    // This will contain the app entry points defined by
    // webpack.client.rails.hot.config and webpack.client.rails.build.config

    // See use of 'vendor' in the CommonsChunkPlugin inclusion below.
    'vendor-bundle': [
      'babel-polyfill',
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

    // https://webpack.github.io/docs/list-of-plugins.html#2-explicit-vendor-chunk
    new webpack.optimize.CommonsChunkPlugin({
      // This name 'vendor-bundle' ties into the entry definition
      name: 'vendor-bundle',

      // We don't want the default vendor.js name
      filename: 'vendor-bundle-[hash].js',

      minChunks(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1
      },
    }),

    new ManifestPlugin({
      publicPath: railsWebpackConfig.output.publicPath,
      writeToFileEmit: true,
    }),
  ],

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
