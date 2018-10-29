const { resolve } = require('path')

const rootPath = process.env.PROJECT_PATH
const appPath = resolve(process.env.PROJECT_PATH, 'app')

module.exports = {
  paths: {
    root: rootPath,
    app: appPath,
    railsConfig: resolve(rootPath, 'config'),
    postcssConfig: resolve(rootPath, '.postcssrc.yml'),
    webpack: {
      config: resolve(rootPath, 'client/config'),
      src: resolve(appPath, 'javascript'),
      clientEntry: resolve(appPath, 'javascript/App/clientStartup.ts'),
      serverEntry: resolve(appPath, 'javascript/App/serverStartup.tsx'),
    },
  },
}
