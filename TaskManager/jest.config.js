module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/task-manager']
};
