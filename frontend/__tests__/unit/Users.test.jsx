import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { User } from '../../firebase/models/Users.js';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

const PROJECT_ID = 'test-project';
let testEnv, testDb;

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
  test('createUser creates a new user document', async () => {
    const testUser = new User(
      "John Doe",
      "john@example.com",
      "1234567890",
      "testUser123"
    );

    await User.createUser(testUser, testDb);

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

  test('getUsers retrieves all user documents', async () => {
    const testUser1 = new User("John Doe", "john@example.com", "1234567890", "testUser123");
    const testUser2 = new User("Jane Doe", "jane@example.com", "0987654321", "testUser456");

    await setDoc(doc(testDb, 'users', testUser1.uid), {
      name: testUser1.name,
      email: testUser1.email,
      phoneNumber: testUser1.phoneNumber,
      uid: testUser1.uid
    });
    await setDoc(doc(testDb, 'users', testUser2.uid), {
      name: testUser2.name,
      email: testUser2.email,
      phoneNumber: testUser2.phoneNumber,
      uid: testUser2.uid
    });

    const users = await User.getUsers(testDb);

    expect(users.length).toBe(2);
  });

  test('getUser retrieves a specific user document', async () => {
    const testUser = new User("John Doe", "john@example.com", "1234567890", "testUser123");

    await setDoc(doc(testDb, 'users', testUser.uid), {
      name: testUser.name,
      email: testUser.email,
      phoneNumber: testUser.phoneNumber,
      uid: testUser.uid
    });

    const user = await User.getUser(testUser.uid, testDb);

    expect(user).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      uid: "testUser123"
    });
  });

  test('updateUser updates an existing user document', async () => {
    const testUser = new User("John Doe", "john@example.com", "1234567890", "testUser123");

    await setDoc(doc(testDb, 'users', testUser.uid), {
      name: testUser.name,
      email: testUser.email,
      phoneNumber: testUser.phoneNumber,
      uid: testUser.uid
    });

    const updatedUser = new User("John Smith", "johnsmith@example.com", "0987654321", "testUser123");
    await User.updateUser(testUser.uid, updatedUser, testDb);

    const userDocRef = doc(testDb, 'users', testUser.uid);
    const userDoc = await getDoc(userDocRef);

    expect(userDoc.exists()).toBe(true);
    expect(userDoc.data()).toMatchObject({
      name: "John Smith",
      email: "johnsmith@example.com",
      phoneNumber: "0987654321",
      uid: "testUser123"
    });
  });

  test('deleteUser removes a user document', async () => {
    const testUser = new User("John Doe", "john@example.com", "1234567890", "testUser123");

    await setDoc(doc(testDb, 'users', testUser.uid), {
      name: testUser.name,
      email: testUser.email,
      phoneNumber: testUser.phoneNumber,
      uid: testUser.uid
    });

    await User.deleteUser(testUser.uid, testDb);

    const userDocRef = doc(testDb, 'users', testUser.uid);
    const userDoc = await getDoc(userDocRef);

    expect(userDoc.exists()).toBe(false);
  });
});

// import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
// import { User } from '../../firebase/models/Users.js';
// import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// const PROJECT_ID = 'test-project';
// let testEnv, testDb;

// beforeAll(async () => {
//   testEnv = await initializeTestEnvironment({
//     projectId: PROJECT_ID,
//     firestore: {
//       host: 'localhost',
//       port: 8080
//     }
//   });
// });

// beforeEach(async () => {
//   await testEnv.clearFirestore();
//   testDb = testEnv.authenticatedContext('testUser').firestore();
// });

// afterAll(async () => {
//   await testEnv.cleanup();
// });

// describe('User Model', () => {
//   test('createUser creates a new user document', async () => {
//     const testUser = new User(
//       "John Doe",
//       "john@example.com",
//       "1234567890",
//       "testUser123"
//     );

//     await User.createUser(testUser, testDb);

//     const userDocRef = doc(testDb, 'users', testUser.uid);
//     const userDoc = await getDoc(userDocRef);

//     expect(userDoc.exists()).toBe(true);
//     expect(userDoc.data()).toMatchObject({
//       name: "John Doe",
//       email: "john@example.com",
//       phoneNumber: "1234567890",
//       uid: "testUser123"
//     });
//   });

//   test('getUsers retrieves all user documents', async () => {
//     const testUser1 = new User("John Doe", "john@example.com", "1234567890", "testUser123");
//     const testUser2 = new User("Jane Doe", "jane@example.com", "0987654321", "testUser456");

//     await User.createUser(testUser1, testDb);
//     await User.createUser(testUser2, testDb);

//     const users = await User.getUsers(testDb);

//     expect(users.length).toBe(2);
//   });

//   test('getUser retrieves a specific user document', async () => {
//     const testUser = new User("John Doe", "john@example.com", "1234567890", "testUser123");

//     await User.createUser(testUser, testDb);

//     const user = await User.getUser(testUser.uid, testDb);

//     expect(user).toMatchObject({
//       name: "John Doe",
//       email: "john@example.com",
//       phoneNumber: "1234567890",
//       uid: "testUser123"
//     });
//   });

//   test('updateUser updates an existing user document', async () => {
//     const testUser = new User("John Doe", "john@example.com", "1234567890", "testUser123");

//     await User.createUser(testUser, testDb);

//     const updatedUser = new User("John Smith", "johnsmith@example.com", "0987654321", "testUser123");
//     await User.updateUser(testUser.uid, updatedUser, testDb);

//     const userDocRef = doc(testDb, 'users', testUser.uid);
//     const userDoc = await getDoc(userDocRef);

//     expect(userDoc.exists()).toBe(true);
//     expect(userDoc.data()).toMatchObject({
//       name: "John Smith",
//       email: "johnsmith@example.com",
//       phoneNumber: "0987654321",
//       uid: "testUser123"
//     });
//   });

//   test('deleteUser removes a user document', async () => {
//     const testUser = new User("John Doe", "john@example.com", "1234567890", "testUser123");

//     await User.createUser(testUser, testDb);
//     await User.deleteUser(testUser.uid, testDb);

//     const userDocRef = doc(testDb, 'users', testUser.uid);
//     const userDoc = await getDoc(userDocRef);

//     expect(userDoc.exists()).toBe(false);
//   });
// });