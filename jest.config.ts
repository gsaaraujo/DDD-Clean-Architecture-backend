export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/modules/core/$1',
    '@agreements/(.*)': '<rootDir>/modules/agreements/$1',
    '@test/(.*)': '<rootDir>/../test/$1',
  },
};
