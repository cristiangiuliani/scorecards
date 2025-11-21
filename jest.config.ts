import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
      },
    }],
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/utils/*-formulas.ts',
    'src/**/utils/*-interpretation.ts',
    '!src/**/*.d.ts',
    '!src/**/_mocks/**',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 45,
      lines: 45,
      statements: 45,
    },
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
};

export default config;
