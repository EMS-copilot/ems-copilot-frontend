const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Next.js 앱 경로
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
