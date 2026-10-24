module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.tsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'CommonJS',
        moduleResolution: 'node',
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
    }],
  },
};
