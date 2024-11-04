module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!firebase|@firebase)'
  ],
};