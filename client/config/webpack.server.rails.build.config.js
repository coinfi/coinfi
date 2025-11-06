const { resolve } = require('path')
const { paths } = require(resolve(
  process.env.PROJECT_PATH,
  'client/config/lib/constants',
))
const webpack = require('webpack')
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader')
const { environment } = require('@rails/webpacker')

const railsWebpackConfig = webpackConfigLoader(paths.railsConfig)

module.exports = {
  // the project dir
  context: paths.webpack.src,
  entry: [paths.webpack.serverEntry],
  output: {
    // Important to NOT use a hash if the server webpack config runs separately from the client one.
    // Otherwise, both would be writing to the same manifest.json file.
    // Additionally, there's no particular need to have a fingerprint (hash) on the server bundle,
    // since it's not cached by the browsers.
    filename: 'server-bundle.js',

    publicPath: railsWebpackConfig.output.publicPath,
    path: railsWebpackConfig.output.path,
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
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ttf|eot)$/,
        use: 'file-loader',
      },
      environment.loaders.get('css'),
      environment.loaders.get('sass'),
      environment.loaders.get('moduleCss'),
      environment.loaders.get('moduleSass'),
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
    ],
  },
  watchOptions: {
    ignored: /node_modules/,
    poll: 5000,
    aggregateTimeout: 300,
  },
}
