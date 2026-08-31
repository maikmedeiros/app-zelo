import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),

  ...nextVitals,
  ...nextTs,
  prettierConfig,

  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    plugins: { prettier: prettierPlugin },
    rules: {
      // O plugin jsx-a11y já vem registrado pelo eslint-config-next; aqui só se completa o
      // conjunto recomendado, que ele não liga inteiro.
      ...jsxA11y.flatConfigs.recommended.rules,

      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  {
    // Regra 1 do plano: nenhum fetch fora de shared/api.
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/shared/api/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'Use shared/api/server.ts ou shared/api/client.ts.' },
      ],
    },
  },
]);
