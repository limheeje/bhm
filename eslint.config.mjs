// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import unusedImports from 'eslint-plugin-unused-imports'

export default withNuxt({
  plugins: {
    prettier: eslintPluginPrettier,
    'unused-imports': unusedImports
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        arrowParens: 'always',
        bracketSpacing: false,
        endOfLine: 'auto',
        'jsxBracketSameLine ': false,
        printWidth: 120,
        proseWrap: 'preserve',
        tabWidth: 2,
        trailingComma: 'none',
        useTabs: false
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'generator-star-spacing': 'off',
    'import/no-mutable-exports': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'all',
        argsIgnorePattern: '^_'
      }
    ],
    'vue/no-v-html': 'off',
    'vue/require-prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/multi-word-component-names': 'off'
  }
})
