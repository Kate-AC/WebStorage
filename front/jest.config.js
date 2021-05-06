module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/setup.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/'
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'node'
  ],
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  globals: {
    'ts-jest': {
      'tsconfig': '<rootDir>/src/tests/tsconfig.jest.json'
    }
  },
  moduleNameMapper: {
    "^/src/$": "<rootDir>/src/"
  }
}

