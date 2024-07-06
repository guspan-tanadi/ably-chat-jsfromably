module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'security', 'jsdoc', 'import', 'simple-import-sort', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended-legacy',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'eol-last': 'error',
    // security/detect-object-injection just gives a lot of false positives
    // see https://github.com/nodesecurity/eslint-plugin-security/issues/21
    'security/detect-object-injection': 'off',
    // the code problem checked by this ESLint rule is automatically checked by the TypeScript compiler
    'no-redeclare': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error'],
        'import/no-unresolved': 'off',
        // TypeScript already enforces these rules better than any eslint setup can
        'no-undef': 'off',
        'no-dupe-class-members': 'off',
        // see:
        // https://github.com/ably/spaces/issues/76
        // https://github.com/microsoft/TypeScript/issues/16577#issuecomment-703190339
        'import/extensions': [
          'error',
          'always',
          {
            ignorePackages: true,
          },
        ],
      },
    },
  ],
  ignorePatterns: ['dist', 'node_modules', 'ably-common', 'typedoc'],
  settings: {
    jsdoc: {
      tagNamePreference: {
        default: 'defaultValue',
      },
    },
  },
};
