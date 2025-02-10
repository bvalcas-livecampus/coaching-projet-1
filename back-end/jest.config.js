export default {
    transform: {},
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.{js,mjs}', '**/?(*.)+(spec|test).{js,mjs}'],
    testPathIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.mjs$': '$1.mjs'
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    moduleFileExtensions: ['js', 'mjs']
};
