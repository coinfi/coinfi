const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  moduleNameMapper: {
    // Parse and add `tsconfig` module paths
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/javascript/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/test/javascript/__mocks__/styleMock.js',
  },
  setupTestFrameworkScriptFile: './node_modules/jest-enzyme/lib/index.js',
  roots: ['app/javascript/packs', 'test/javascript'],
  moduleDirectories: ['node_modules', 'app/javascript/packs'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$',
}
