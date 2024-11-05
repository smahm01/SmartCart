import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { User } from '../../firebase/models/Users.js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

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
  test('addUser creates a new user document', async () => {
    const testUser = new User(
      "John Doe",
      "john@example.com",
      "1234567890",
      "testUser123"
    );

    await User.addUser(testUser, testDb);

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

    await User.addUser(testUser1, testDb);
    await User.addUser(testUser2, testDb);

    const result = await User.getUsers(testDb);

    expect(result.success).toBe(true);
    expect(result.users.length).toBe(2);
  });

  test('getUser retrieves a specific user document', async () => {
    const testUser = new User("John Doe", "john@example.com", "1234567890", "testUser123");

    await User.addUser(testUser, testDb);

    const result = await User.getUser(testUser.uid, testDb);

    expect(result.success).toBe(true);
    expect(result.user).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      uid: "testUser123"
    });
  });

  test('updateUser updates an existing user document', async () => {
    const testUser = new User("John Doe", "john@example.com", "1234567890", "testUser123");

    await User.addUser(testUser, testDb);

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

    await User.addUser(testUser, testDb);
    await User.deleteUser(testUser.uid, testDb);

    const userDocRef = doc(testDb, 'users', testUser.uid);
    const userDoc = await getDoc(userDocRef);

    expect(userDoc.exists()).toBe(false);
  });
});