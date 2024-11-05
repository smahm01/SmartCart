// Mock Firebase config
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Increase timeout for all tests
jest.setTimeout(10000);

global.__DEV__ = true;

jest.mock('react-native-gesture-handler', () => {
    return {
      GestureHandlerRootView: ({ children }) => children,
      // Add other mocks if needed
    };
});

jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
}));


  