module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'json'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['index.js', '!**/node_modules/**', '!**/vendor/**',],
    coverageReporters: ['text', 'lcov'],
};