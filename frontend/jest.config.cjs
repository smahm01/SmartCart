// module.exports = {
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   transformIgnorePatterns: [
//     'node_modules/(?!(react-native|@react-native|react-native-button|react-native-gesture-handler|@expo|expo|@unimodules|unimodules-permissions-interface|unimodules-sensors-interface|unimodules-constants-interface|unimodules-file-system-interface|expo-camera|expo-sensors|expo-permissions|expo-constants)/)'
//   ],
//   transform: {
//     '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
//   },
//   setupFiles: ['./jest.setup.js'],
// };

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-button|react-native-gesture-handler|@expo|expo|@unimodules|unimodules-permissions-interface|unimodules-sensors-interface|unimodules-constants-interface|unimodules-file-system-interface|expo-camera|expo-sensors|expo-permissions|expo-constants)/)'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react'
      }
    }]
  },
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    // Mock vector icons
    '@expo/vector-icons/(.*)': '<rootDir>/__mocks__/expoVectorIconsMock.js',
    '@expo/vector-icons': '<rootDir>/__mocks__/expoVectorIconsMock.js',
    // Mock other static files
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsconfig: 'tsconfig.jest.json'
    }
  }
};