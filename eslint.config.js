import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.env', '**/.env.*', 'src/index.css'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react: reactPlugin },
    languageOptions: { globals: { ...globals.browser } },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
    },
  },

  reactHooksPlugin.configs.flat.recommended,

  sonarjs.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'react/no-array-index-key': 'warn',
      'react/prop-types': 'off',
      'react-hooks/incompatible-library': 'off',
      'sonarjs/no-nested-conditional': 'off',
    },
  },

  { linterOptions: { reportUnusedDisableDirectives: true } },

  {
    files: ['vite.config.ts', 'vitest.config.ts'],
    languageOptions: { globals: { ...globals.node } },
  },

  eslintPluginPrettierRecommended
);
