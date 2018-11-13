const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { resolve } = require('path')
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader')

const { paths } = require(resolve(
  process.env.PROJECT_PATH,
  'client/config/lib/constants',
))
const config = require(resolve(
  paths.webpack.config,
  'webpack.client.rails.hot.config',
))
const railsWebpackConfig = webpackConfigLoader(paths.railsConfig)

const hotReloadingUrl = railsWebpackConfig.output.publicPathWithHost
const hotReloadingPort = railsWebpackConfig.settings.dev_server.port
const hotReloadingHostname = railsWebpackConfig.settings.dev_server.host

const compiler = webpack(config)

const devServer = new WebpackDevServer(compiler, {
  proxy: { '*': `http://${hotReloadingHostname}:${hotReloadingPort}` },
  publicPath: railsWebpackConfig.output.publicPathWithHost,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
  hot: true,
  inline: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  lazy: false,
  stats: {
    colors: true,
    hash: false,
    version: false,
    chunks: false,
    children: false,
  },
})

devServer.listen(hotReloadingPort, hotReloadingHostname, (err) => {
  if (err) console.error(err)
  console.log(
    `=> 🔥  Webpack development server is running on port ${hotReloadingUrl}`,
  )
})

compiler.plugin('done', () => {
  process.stdout.write('Webpack: Done!')
})
