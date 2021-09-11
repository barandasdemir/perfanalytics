/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coveragePathIgnorePatterns: ['<rootDir>/src/index.js', '<rootDir>/src/db.js'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/test/setupFile.js'],
  globalSetup: '<rootDir>/test/globalSetup.js',
  globalTeardown: '<rootDir>/test/globalTeardown.js',
};

module.exports = config;
