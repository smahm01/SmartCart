import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { ShoppingList } from '../../firebase/models/ShoppingList.js';
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
  // Initialize testDb here instead of in beforeEach
  testDb = testEnv.authenticatedContext('testUser').firestore();
});

beforeEach(async () => {
  // Make sure to await the clearance
  await testEnv.clearFirestore();
  // Reset the testDb connection after clearing
  testDb = testEnv.authenticatedContext('testUser').firestore();
});

afterEach(async () => {
  // Additional cleanup after each test
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('ShoppingList Model', () => {
  const createDummyHousehold = async (householdId) => {
    await addDoc(collection(testDb, 'households'), {
      id: householdId,
      name: `Household ${householdId}`,
      admins: ['admin1'],
      people: ['person1', 'person2']
    });
  };

  test('createShoppingList creates a new shopping list document', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testShoppingList = new ShoppingList(householdId, "category1", "name1");

    const docRef = await ShoppingList.createShoppingList(testShoppingList.householdId, testShoppingList, testDb);
    const shoppingListDocRef = doc(testDb, `households/${testShoppingList.householdId}/shopping_list`, docRef.id);
    const shoppingListDoc = await getDoc(shoppingListDocRef);

    expect(shoppingListDoc.exists()).toBe(true);
    expect(shoppingListDoc.data()).toMatchObject({
      householdId: householdId,
      category: "category1",
      name: "name1"
    });
  });

  test('getShoppingLists retrieves all shopping list documents', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testShoppingList1 = new ShoppingList(householdId, "category1", "name1");
    const testShoppingList2 = new ShoppingList(householdId, "category2", "name2");

    await addDoc(collection(testDb, `households/${testShoppingList1.householdId}/shopping_list`), {
      householdId: testShoppingList1.householdId,
      category: testShoppingList1.category,
      name: testShoppingList1.name
    });
    await addDoc(collection(testDb, `households/${testShoppingList2.householdId}/shopping_list`), {
      householdId: testShoppingList2.householdId,
      category: testShoppingList2.category,
      name: testShoppingList2.name
    });

    const shoppingLists = await ShoppingList.getShoppingLists(testShoppingList1.householdId, testDb);

    expect(shoppingLists.length).toBe(2);
  });

  test('getShoppingList retrieves a specific shopping list document', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testShoppingList = new ShoppingList(householdId, "category1", "name1");

    const docRef = await addDoc(collection(testDb, `households/${testShoppingList.householdId}/shopping_list`), {
      householdId: testShoppingList.householdId,
      category: testShoppingList.category,
      name: testShoppingList.name
    });

    const shoppingList = await ShoppingList.getShoppingList(testShoppingList.householdId, docRef.id, testDb);

    expect(shoppingList).toMatchObject({
      householdId: householdId,
      category: "category1",
      name: "name1"
    });
  });

  test('updateShoppingList updates an existing shopping list document', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testShoppingList = new ShoppingList(householdId, "category1", "name1");

    const docRef = await addDoc(collection(testDb, `households/${testShoppingList.householdId}/shopping_list`), {
      householdId: testShoppingList.householdId,
      category: testShoppingList.category,
      name: testShoppingList.name
    });

    const updatedShoppingList = new ShoppingList(householdId, "category2", "name2");
    await ShoppingList.updateShoppingList(testShoppingList.householdId, docRef.id, updatedShoppingList, testDb);

    const shoppingListDocRef = doc(testDb, `households/${testShoppingList.householdId}/shopping_list`, docRef.id);
    const shoppingListDoc = await getDoc(shoppingListDocRef);

    expect(shoppingListDoc.exists()).toBe(true);
    expect(shoppingListDoc.data()).toMatchObject({
      householdId: householdId,
      category: "category2",
      name: "name2"
    });
  });

  test('deleteShoppingList removes a shopping list document', async () => {
    const householdId = 'householdId1';
    await createDummyHousehold(householdId);

    const testShoppingList = new ShoppingList(householdId, "category1", "name1");

    const docRef = await addDoc(collection(testDb, `households/${testShoppingList.householdId}/shopping_list`), {
      householdId: testShoppingList.householdId,
      category: testShoppingList.category,
      name: testShoppingList.name
    });

    await ShoppingList.deleteShoppingList(testShoppingList.householdId, docRef.id, testDb);

    const shoppingListDocRef = doc(testDb, `households/${testShoppingList.householdId}/shopping_list`, docRef.id);
    const shoppingListDoc = await getDoc(shoppingListDocRef);

    expect(shoppingListDoc.exists()).toBe(false);
  });
});

// import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
// import { ShoppingList } from '../../firebase/models/ShoppingList.js';
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

// describe('ShoppingList Model', () => {
//   test('createShoppingList creates a new shopping list document', async () => {
//     const testShoppingList = new ShoppingList("householdId1", "category1", "name1");

//     const docRef = await ShoppingList.createShoppingList(testShoppingList.householdId, testShoppingList, testDb);
//     const shoppingListDocRef = doc(testDb, `households/${testShoppingList.householdId}/shopping_list`, docRef.id);
//     const shoppingListDoc = await getDoc(shoppingListDocRef);

//     expect(shoppingListDoc.exists()).toBe(true);
//     expect(shoppingListDoc.data()).toMatchObject({
//       householdId: "householdId1",
//       category: "category1",
//       name: "name1"
//     });
//   });

//   test('getShoppingLists retrieves all shopping list documents', async () => {
//     const testShoppingList1 = new ShoppingList("householdId1", "category1", "name1");
//     const testShoppingList2 = new ShoppingList("householdId1", "category2", "name2");

//     await addDoc(collection(testDb, `households/${testShoppingList1.householdId}/shopping_list`), {
//       householdId: testShoppingList1.householdId,
//       category: testShoppingList1.category,
//       name: testShoppingList1.name
//     });
//     await addDoc(collection(testDb, `households/${testShoppingList2.householdId}/shopping_list`), {
//       householdId: testShoppingList2.householdId,
//       category: testShoppingList2.category,
//       name: testShoppingList2.name
//     });

//     const shoppingLists = await ShoppingList.getShoppingLists(testShoppingList1.householdId, testDb);

//     expect(shoppingLists.length).toBe(2);
//   });

//   test('getShoppingList retrieves a specific shopping list document', async () => {
//     const testShoppingList = new ShoppingList("householdId1", "category1", "name1");

//     const docRef = await addDoc(collection(testDb, `households/${testShoppingList.householdId}/shopping_list`), {
//       householdId: testShoppingList.householdId,
//       category: testShoppingList.category,
//       name: testShoppingList.name
//     });

//     const shoppingList = await ShoppingList.getShoppingList(testShoppingList.householdId, docRef.id, testDb);

//     expect(shoppingList).toMatchObject({
//       householdId: "householdId1",
//       category: "category1",
//       name: "name1"
//     });
//   });

//   test('updateShoppingList updates an existing shopping list document', async () => {
//     const testShoppingList = new ShoppingList("householdId1", "category1", "name1");

//     const docRef = await addDoc(collection(testDb, `households/${testShoppingList.householdId}/shopping_list`), {
//       householdId: testShoppingList.householdId,
//       category: testShoppingList.category,
//       name: testShoppingList.name
//     });

//     const updatedShoppingList = new ShoppingList("householdId1", "category2", "name2");
//     await ShoppingList.updateShoppingList(testShoppingList.householdId, docRef.id, updatedShoppingList, testDb);

//     const shoppingListDocRef = doc(testDb, `households/${testShoppingList.householdId}/shopping_list`, docRef.id);
//     const shoppingListDoc = await getDoc(shoppingListDocRef);

//     expect(shoppingListDoc.exists()).toBe(true);
//     expect(shoppingListDoc.data()).toMatchObject({
//       householdId: "householdId1",
//       category: "category2",
//       name: "name2"
//     });
//   });

//   test('deleteShoppingList removes a shopping list document', async () => {
//     const testShoppingList = new ShoppingList("householdId1", "category1", "name1");

//     const docRef = await addDoc(collection(testDb, `households/${testShoppingList.householdId}/shopping_list`), {
//       householdId: testShoppingList.householdId,
//       category: testShoppingList.category,
//       name: testShoppingList.name
//     });

//     await ShoppingList.deleteShoppingList(testShoppingList.householdId, docRef.id, testDb);

//     const shoppingListDocRef = doc(testDb, `households/${testShoppingList.householdId}/shopping_list`, docRef.id);
//     const shoppingListDoc = await getDoc(shoppingListDocRef);

//     expect(shoppingListDoc.exists()).toBe(false);
//   });
// });