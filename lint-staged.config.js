module.exports = {
  linters: {
    '**/*.+(js|jsx)': ['eslint --fix', 'prettier --write', 'git add'],
    '**/*.+(css|sass|less|scss|json|yml|yaml|md|graphql)': [
      'prettier --write',
      'git add',
    ],
  },
}
