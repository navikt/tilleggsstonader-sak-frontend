import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import _import from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [{
    ignores: ['src/frontend/Sider/Klage/*'],
}, ...fixupConfigRules(compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
)), {
    plugins: {
        '@typescript-eslint': fixupPluginRules(typescriptEslint),
        prettier: fixupPluginRules(prettier),
        'react-hooks': fixupPluginRules(reactHooks),
        react: fixupPluginRules(react),
        import: fixupPluginRules(_import),
        'unused-imports': unusedImports,
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: 'detect',
        },
    },

    rules: {
        'import/extensions': ['off', 'ignorePackages', {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
        }],

        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/no-unused-expressions': ['error', { 'allowShortCircuit': true, 'allowTernary': true }],
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'prettier/prettier': 'warn',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'jsx-a11y/interactive-supports-focus': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        'react/jsx-key': ['error', {
            checkFragmentShorthand: true,
            checkKeyMustBeforeSpread: true,
        }],

        'no-console': 'warn',
        'import/export': 'warn',

        'import/order': ['warn', {
            alphabetize: {
                order: 'asc',
                caseInsensitive: true,
            },

            'newlines-between': 'always',
            groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],

            pathGroups: [{
                pattern: 'react',
                group: 'external',
                position: 'before',
            }, {
                pattern: '@navikt/**',
                group: 'internal',
                position: 'before',
            }],

            pathGroupsExcludedImportTypes: ['builtin'],
        }],
    },
}];