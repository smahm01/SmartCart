import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { Pantry } from '../../firebase/models/Pantry.js';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

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

describe('Pantry Model', () => {
  const createDummyHousehold = async (householdId) => {
    await addDoc(collection(testDb, 'households'), {
      id: householdId,
      name: `Household ${householdId}`,
      admins: ['admin1'],
      people: ['person1', 'person2']
    });
  };

  test('createPantry creates a new pantry document', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testPantry = new Pantry(householdId, "category1", "name1");

    const docRef = await Pantry.createPantry(testPantry.householdId, testPantry, testDb);
    const pantryDocRef = doc(testDb, `households/${testPantry.householdId}/pantry`, docRef.id);
    const pantryDoc = await getDoc(pantryDocRef);

    expect(pantryDoc.exists()).toBe(true);
    expect(pantryDoc.data()).toMatchObject({
      householdId: householdId,
      category: "category1",
      name: "name1"
    });
  });

  test('getPantries retrieves all pantry documents', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testPantry1 = new Pantry(householdId, "category1", "name1");
    const testPantry2 = new Pantry(householdId, "category2", "name2");

    await addDoc(collection(testDb, `households/${testPantry1.householdId}/pantry`), {
      householdId: testPantry1.householdId,
      category: testPantry1.category,
      name: testPantry1.name
    });
    await addDoc(collection(testDb, `households/${testPantry2.householdId}/pantry`), {
      householdId: testPantry2.householdId,
      category: testPantry2.category,
      name: testPantry2.name
    });

    const pantries = await Pantry.getPantries(testPantry1.householdId, testDb);

    expect(pantries.length).toBe(2);
  });

  test('getPantry retrieves a specific pantry document', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testPantry = new Pantry(householdId, "category1", "name1");

    const docRef = await addDoc(collection(testDb, `households/${testPantry.householdId}/pantry`), {
      householdId: testPantry.householdId,
      category: testPantry.category,
      name: testPantry.name
    });

    const pantry = await Pantry.getPantry(testPantry.householdId, docRef.id, testDb);

    expect(pantry).toMatchObject({
      householdId: householdId,
      category: "category1",
      name: "name1"
    });
  });

  test('updatePantry updates an existing pantry document', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testPantry = new Pantry(householdId, "category1", "name1");

    const docRef = await addDoc(collection(testDb, `households/${testPantry.householdId}/pantry`), {
      householdId: testPantry.householdId,
      category: testPantry.category,
      name: testPantry.name
    });

    const updatedPantry = new Pantry(householdId, "category2", "name2");
    await Pantry.updatePantry(testPantry.householdId, docRef.id, updatedPantry, testDb);

    const pantryDocRef = doc(testDb, `households/${testPantry.householdId}/pantry`, docRef.id);
    const pantryDoc = await getDoc(pantryDocRef);

    expect(pantryDoc.exists()).toBe(true);
    expect(pantryDoc.data()).toMatchObject({
      householdId: householdId,
      category: "category2",
      name: "name2"
    });
  });

  test('deletePantry removes a pantry document', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testPantry = new Pantry(householdId, "category1", "name1");

    const docRef = await addDoc(collection(testDb, `households/${testPantry.householdId}/pantry`), {
      householdId: testPantry.householdId,
      category: testPantry.category,
      name: testPantry.name
    });

    await Pantry.deletePantry(testPantry.householdId, docRef.id, testDb);

    const pantryDocRef = doc(testDb, `households/${testPantry.householdId}/pantry`, docRef.id);
    const pantryDoc = await getDoc(pantryDocRef);

    expect(pantryDoc.exists()).toBe(false);
  });
});


// import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
// import { Pantry } from '../../firebase/models/Pantry.js';
// import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

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

// describe('Pantry Model', () => {
//   test('createPantry creates a new pantry document', async () => {
//     const testPantry = new Pantry("householdId1", "category1", "name1");

//     const docRef = await Pantry.createPantry(testPantry.householdId, testPantry, testDb);
//     const pantryDocRef = doc(testDb, `households/${testPantry.householdId}/pantry`, docRef.id);
//     const pantryDoc = await getDoc(pantryDocRef);

//     expect(pantryDoc.exists()).toBe(true);
//     expect(pantryDoc.data()).toMatchObject({
//       householdId: "householdId1",
//       category: "category1",
//       name: "name1"
//     });
//   });

//   test('getPantries retrieves all pantry documents', async () => {
//     const testPantry1 = new Pantry("householdId1", "category1", "name1");
//     const testPantry2 = new Pantry("householdId1", "category2", "name2");

//     await addDoc(collection(testDb, `households/${testPantry1.householdId}/pantry`), {
//       householdId: testPantry1.householdId,
//       category: testPantry1.category,
//       name: testPantry1.name
//     });
//     await addDoc(collection(testDb, `households/${testPantry2.householdId}/pantry`), {
//       householdId: testPantry2.householdId,
//       category: testPantry2.category,
//       name: testPantry2.name
//     });

//     const pantries = await Pantry.getPantries(testPantry1.householdId, testDb);

//     expect(pantries.length).toBe(2);
//   });

//   test('getPantry retrieves a specific pantry document', async () => {
//     const testPantry = new Pantry("householdId1", "category1", "name1");

//     const docRef = await addDoc(collection(testDb, `households/${testPantry.householdId}/pantry`), {
//       householdId: testPantry.householdId,
//       category: testPantry.category,
//       name: testPantry.name
//     });

//     const pantry = await Pantry.getPantry(testPantry.householdId, docRef.id, testDb);

//     expect(pantry).toMatchObject({
//       householdId: "householdId1",
//       category: "category1",
//       name: "name1"
//     });
//   });

//   test('updatePantry updates an existing pantry document', async () => {
//     const testPantry = new Pantry("householdId1", "category1", "name1");

//     const docRef = await addDoc(collection(testDb, `households/${testPantry.householdId}/pantry`), {
//       householdId: testPantry.householdId,
//       category: testPantry.category,
//       name: testPantry.name
//     });

//     const updatedPantry = new Pantry("householdId1", "category2", "name2");
//     await Pantry.updatePantry(testPantry.householdId, docRef.id, updatedPantry, testDb);

//     const pantryDocRef = doc(testDb, `households/${testPantry.householdId}/pantry`, docRef.id);
//     const pantryDoc = await getDoc(pantryDocRef);

//     expect(pantryDoc.exists()).toBe(true);
//     expect(pantryDoc.data()).toMatchObject({
//       householdId: "householdId1",
//       category: "category2",
//       name: "name2"
//     });
//   });

//   test('deletePantry removes a pantry document', async () => {
//     const testPantry = new Pantry("householdId1", "category1", "name1");

//     const docRef = await addDoc(collection(testDb, `households/${testPantry.householdId}/pantry`), {
//       householdId: testPantry.householdId,
//       category: testPantry.category,
//       name: testPantry.name
//     });

//     await Pantry.deletePantry(testPantry.householdId, docRef.id, testDb);

//     const pantryDocRef = doc(testDb, `households/${testPantry.householdId}/pantry`, docRef.id);
//     const pantryDoc = await getDoc(pantryDocRef);

//     expect(pantryDoc.exists()).toBe(false);
//   });
// });