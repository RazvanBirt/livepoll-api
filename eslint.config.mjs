import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Google-style rules manually applied
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': 'warn',
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
    },
  },
  // Ignore files/folders
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'prisma/',
      'generated/',
    ],
  },
  // Base JS + TS rules
  js.configs.recommended,
  tseslint.configs.recommended,
]);
