module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        'node_modules',
        'dist',
        'public',
        'tests',
    ],
    testEnvironment: 'node',
    moduleNameMapper: {
        'src(.*)$': '<rootDir>/src$1',
    },
};
