const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../../../tsconfig.json');

module.exports = {
  transform: {
   '^.+\\.ts$': ['@swc/jest'],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: ['node_modules/(?!(?:@map-colonies/mc-utils|@turf|concaveman|rbush)/)'],
  coverageReporters: ['text', 'html'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/DAL/**',
    '!*/node_modules/',
    '!/vendor/**',
    '!*/common/**',
    '!**/controllers/**',
    '!**/routes/**',
    '!<rootDir>/src/*',
  ],
  coverageDirectory: '<rootDir>/coverage',
  reporters: [
    'default',
    ['jest-html-reporters', { multipleReportsUnitePath: './reports', pageTitle: 'unit', publicPath: './reports', filename: 'unit.html' }],
  ],
  rootDir: '../../../.',
  setupFilesAfterEnv: ['<rootDir>/tests/configurations/jest.setup.ts', 'jest-extended/all'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'require'],
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
