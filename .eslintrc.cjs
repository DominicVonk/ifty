/* eslint-env node */

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier/prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
