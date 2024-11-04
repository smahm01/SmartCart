import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { User } from '../../firebase/models/Users.js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const PROJECT_ID = "test-project";
let testEnv;
let testDb;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: 'localhost',
      port: 8080
    }
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  testDb = testEnv.authenticatedContext('testUser').firestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('User Model', () => {
  test('addUser creates a new user document', async () => {
    // Create test user
    const testUser = new User(
      "John Doe",
      "john@example.com",
      "1234567890",
      "testUser123"
    );

    // Add user
    await User.addUser(testUser, testDb);
    
    // Verify user was added by checking the specific document
    const userDocRef = doc(testDb, 'users', testUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    expect(userDoc.exists()).toBe(true);
    expect(userDoc.data()).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      uid: "testUser123"
    });
  });
});








// describe('Users', () => {
//     beforeEach(() => {
//       mockCollection.mockClear();
//       mockAddDoc.mockClear();
//     });
  
//     test('addUser', async () => {
//       const sampleUser = {
//         name: 'John Doe',
//         email: 'john.doe@email.com',
//         phoneNumber: '1234567890',
//         uid: '123456'
//       };
  
//       // Call the addUser function
//       await User.addUser(sampleUser);
  
//       // Verify the collection function was called with the correct arguments
//       expect(mockCollection).toHaveBeenCalledWith('users');
  
//       // Verify the addDoc function was called with the correct arguments
//       expect(mockAddDoc).toHaveBeenCalledWith({
//         name: sampleUser.name,
//         email: sampleUser.email,
//         phoneNumber: sampleUser.phoneNumber,
//         uid: sampleUser.uid
//       });
//     });
//   });


// // Mock Firestore functions
// jest.mock('firebase/firestore', () => ({
//     collection: jest.fn(),
//     addDoc: jest.fn(),
//     getFirestore: jest.fn(),
// }));

// // Mock Firebase app initialization
// jest.mock('firebase/app', () => ({
//     initializeApp: jest.fn()
// }));

// // Mock Firebase Auth
// jest.mock('firebase/auth', () => ({
//     getAuth: jest.fn()
// }));

// describe('Users', () => {
//     let mockFirestore;
//     let mockAuth;
//     let mockApp;

//     beforeAll(() => {
//         // Mock the Firestore instance
//         mockFirestore = {};
//         getFirestore.mockReturnValue(mockFirestore);

//         // Mock the Firebase app initialization
//         mockApp = {};
//         initializeApp.mockReturnValue(mockApp);

//         // Mock the Auth instance
//         mockAuth = {};
//         getAuth.mockReturnValue(mockAuth);
//     });

//     test('addUser', async () => {
//         const sampleUser = {
//             name: 'John Doe',
//             email: 'john.doe@email.com',
//             phoneNumber: '1234567890',
//             uid: '123456'
//         };

//         // Mock the collection function to return a mock collection reference
//         const mockCollectionRef = {};
//         collection.mockReturnValue(mockCollectionRef);

//         // Mock the addDoc function to resolve with a mock document reference
//         addDoc.mockResolvedValue({ id: sampleUser.uid });

//         // Call the addUser function
//         await User.addUser(sampleUser);

//         // Verify the collection function was called with the correct arguments
//         expect(collection).toHaveBeenCalledWith(mockFirestore, 'users');

//         // Verify the addDoc function was called with the correct arguments
//         expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
//             name: sampleUser.name,
//             email: sampleUser.email,
//             phoneNumber: sampleUser.phoneNumber,
//             uid: sampleUser.uid
//         });
//     });
// });