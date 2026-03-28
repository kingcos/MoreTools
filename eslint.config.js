import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Vue 3 rules
  ...pluginVue.configs['flat/recommended'],

  // Parse <script setup lang="ts"> in Vue SFCs correctly
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // Disable rules that conflict with Prettier
  prettierConfig,

  // Project-specific overrides
  {
    files: ['src/**/*.{ts,vue}'],
    rules: {
      // Allow explicit any when there is genuinely no better type
      '@typescript-eslint/no-explicit-any': 'warn',
      // Keep lint non-blocking for existing legacy code; gradually tighten later
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
      'vue/multi-word-component-names': 'warn',
      // Vue: enforce self-closing on void elements
      'vue/html-self-closing': ['warn', { html: { void: 'always' } }],
      // Vue: consistent component name casing
      'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
    },
  },

  // Ignore build artefacts and config files
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts'],
  },
]
