module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        'standard',
    ],
    env: {
        browser: true,
    },
    globals: {
        'Logger': true,
        'UrlFetchApp': true,
        'SpreadsheetApp': true,
        'CacheService': true,
    },
    rules: {
        'block-scoped-var': 'error',
        'camelcase': ['error', { properties: 'always' }],
        'comma-dangle': ['error', {
            'arrays': 'always-multiline',
            'objects': 'always-multiline',
            'imports': 'always-multiline',
            'exports': 'always-multiline',
            'functions': 'never'
        }],
        'complexity': ['error', 10],
        'consistent-this': 'error',
        'curly': ['error', 'all'],
        'dot-notation': 'error',
        'eqeqeq': 'error',
        'for-direction': 'error',
        'global-require': 'error',
        'guard-for-in': 'error',
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'max-len': ['warn', { code: 120 }],
        'no-alert': 'error',
        'no-await-in-loop': 'error',
        'no-catch-shadow': 'error',
        'no-div-regex': 'error',
        'no-else-return': 'error',
        'no-eq-null': 'error',
        'no-loop-func': 'error',
        'no-param-reassign': 'error',
        'no-process-exit': 'error',
        'no-return-assign': 'error',
        'no-script-url': 'error',
        'no-shadow': 'error',
        'no-unused-expressions': 'error',
        'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true }],
        'no-useless-concat': 'error',
        'no-var': 'error',
        'no-void': 'error',
        'object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
        'object-property-newline': 'off',
        'object-shorthand': ['error', 'always', { avoidExplicitReturnArrows: true }],
        'radix': 'error',
        'require-await': 'error',
        'require-yield': 'error',
        'semi': ['error', 'always'],
        'space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],

        'import/no-anonymous-default-export': ['error', { allowCallExpression: false }],
        'import/no-default-export': ['error'],

        'standard/object-curly-even-spacing': 'off',
    },
    overrides: [
        // Node files.
        {
            files: [
                'webpack.config.js'
            ],
            parserOptions: {
                sourceType: 'script',
                ecmaVersion: 2016
            },
            env: {
                browser: false,
                node: true
            },
            rules: {
                'callback-return': 'error'
            }
        },
    ]
};
