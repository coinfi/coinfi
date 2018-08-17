module.exports = {
  linters: {
    '**/*.+(ts|tsx)': ['tslint --fix', 'prettier --write', 'git add'],
    '**/*.+(js|jsx)': ['eslint --fix', 'prettier --write', 'git add'],
    '**/*.+(css|sass|less|scss|json|yml|yaml|md|graphql)': [
      'prettier --write',
      'git add',
    ],
  },
}
