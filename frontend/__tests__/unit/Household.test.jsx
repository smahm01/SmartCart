import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { Household } from '../../firebase/models/Household.js';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';

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

describe('Household Model', () => {
  test('createHousehold creates a new household document', async () => {
    const testHousehold = new Household(
      "Doe Family",
      ["admin1"],
      ["person1", "person2"]
    );

    const docRef = await Household.createHousehold(testHousehold, testDb);
    const householdDocRef = doc(testDb, 'households', docRef.id);
    const householdDoc = await getDoc(householdDocRef);

    expect(householdDoc.exists()).toBe(true);
    expect(householdDoc.data()).toMatchObject({
      name: "Doe Family",
      admins: ["admin1"],
      people: ["person1", "person2"]
    });
  });

  test('getHouseholds retrieves all household documents', async () => {
    const testHousehold1 = new Household("Doe Family", ["admin1"], ["person1", "person2"]);
    const testHousehold2 = new Household("Smith Family", ["admin2"], ["person3", "person4"]);

    await addDoc(collection(testDb, 'households'), {
      name: testHousehold1.name,
      admins: testHousehold1.admins,
      people: testHousehold1.people
    });
    await addDoc(collection(testDb, 'households'), {
      name: testHousehold2.name,
      admins: testHousehold2.admins,
      people: testHousehold2.people
    });

    const households = await Household.getHouseholds(testDb);

    expect(households.length).toBe(2);
  });

  test('getHousehold retrieves a specific household document', async () => {
    const testHousehold = new Household("Doe Family", ["admin1"], ["person1", "person2"]);

    const docRef = await addDoc(collection(testDb, 'households'), {
      name: testHousehold.name,
      admins: testHousehold.admins,
      people: testHousehold.people
    });

    const household = await Household.getHousehold(docRef.id, testDb);

    expect(household).toMatchObject({
      name: "Doe Family",
      admins: ["admin1"],
      people: ["person1", "person2"]
    });
  });

  test('updateHousehold updates an existing household document', async () => {
    const testHousehold = new Household("Doe Family", ["admin1"], ["person1", "person2"]);

    const docRef = await addDoc(collection(testDb, 'households'), {
      name: testHousehold.name,
      admins: testHousehold.admins,
      people: testHousehold.people
    });

    const updatedHousehold = new Household("Smith Family", ["admin3"], ["person5", "person6"]);
    await Household.updateHousehold(docRef.id, updatedHousehold, testDb);

    const householdDocRef = doc(testDb, 'households', docRef.id);
    const householdDoc = await getDoc(householdDocRef);

    expect(householdDoc.exists()).toBe(true);
    expect(householdDoc.data()).toMatchObject({
      name: "Smith Family",
      admins: ["admin3"],
      people: ["person5", "person6"]
    });
  });

  test('deleteHousehold removes a household document', async () => {
    const testHousehold = new Household("Doe Family", ["admin1"], ["person1", "person2"]);

    const docRef = await addDoc(collection(testDb, 'households'), {
      name: testHousehold.name,
      admins: testHousehold.admins,
      people: testHousehold.people
    });

    await Household.deleteHousehold(docRef.id, testDb);

    const householdDocRef = doc(testDb, 'households', docRef.id);
    const householdDoc = await getDoc(householdDocRef);

    expect(householdDoc.exists()).toBe(false);
  });
});