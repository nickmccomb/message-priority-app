// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['bun.setup.ts', '**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'import/order': 'off', // Allow imports after mocks in bun.setup.ts
      'import/first': 'off', // Allow imports after mocks in bun.setup.ts
      'react/display-name': 'off', // Mock components don't need display names
      '@typescript-eslint/no-require-imports': 'off', // Allow require in bun.setup.ts if needed
    },
  },
]);
