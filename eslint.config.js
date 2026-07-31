const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-bitwise': ['error'],
      'no-trailing-spaces': ['warn'],
      'no-else-return': ['off'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-underscore-dangle': ['warn', { allow: ['_token', '_error'] }],
      'func-names': ['warn', 'as-needed'],
      'no-redeclare': ['error'],
      'no-shadow': ['warn'],
      'padded-blocks': ['warn', 'never'],
      'no-multiple-empty-lines': ['warn', { max: 2 }],
      semi: ['warn'],
      'new-cap': ['off'],

      'react/display-name': ['off'],
      'react/jsx-filename-extension': ['off'],
      'react/jsx-sort-props': ['off'],
      'react/no-unescaped-entities': ['off'],
      'react/prop-types': ['off'],
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
      'react-hooks/exhaustive-deps': ['warn'],
      'react-hooks/rules-of-hooks': ['error'],
    },
  },
];
