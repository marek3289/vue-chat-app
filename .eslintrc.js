module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    document: true,
  },
  extends: [
    'eslint:recommended',
    "plugin:vue/vue3-essential",
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {},
}
