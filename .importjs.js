module.exports = {
    excludes: [
        './.git/**',
        './coverage/**',
        './dist/**',
        './node_modules/**',
        './public/**',
        './tests/**',
    ],
    logLevel: 'debug',
    useRelativePaths: false,
    tab: '    ',
    importDevDependencies: false,
    namedExports: {
        'lodash': ['isUndefined', 'range'],
    }
};
