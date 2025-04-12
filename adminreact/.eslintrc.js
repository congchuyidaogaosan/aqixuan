module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2020: true
  },
  extends: [],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
}; 