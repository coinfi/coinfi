module.exports = {
  linters: {
    '**/*.+(ts|tsx)': ['tslint --fix', 'prettier --write', 'git add'],
    '**/*.+(js|jsx|vue)': ['eslint --fix', 'prettier --write', 'git add'],
    '**/*.+(css|sass|less|scss|json|graphql)': ['prettier --write', 'git add'],
  },
}
