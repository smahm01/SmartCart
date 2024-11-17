import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { StockedItem } from '../../firebase/models/StockedItem.js';
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

describe('StockedItem Model', () => {
  const createDummyHousehold = async (householdId) => {
    await addDoc(collection(testDb, 'households'), {
      id: householdId,
      name: `Household ${householdId}`,
      admins: ['admin1'],
      people: ['person1', 'person2']
    });
  };

  const createDummyPantry = async (householdId, pantryId) => {
    await addDoc(collection(testDb, `households/${householdId}/pantry`), {
      id: pantryId,
      category: `Category ${pantryId}`,
      name: `Pantry ${pantryId}`
    });
  };

  test('createStockedItem creates a new stocked item document', async () => {
    const householdId = 'householdId1';
    const pantryId = 'pantryId1';
    await createDummyHousehold(householdId);
    await createDummyPantry(householdId, pantryId);

    const testStockedItem = new StockedItem(householdId, pantryId, "brand1", "category1", "2023-12-31", "location1", "name1", 10);

    const docRef = await StockedItem.createStockedItem(testStockedItem.householdId, testStockedItem.pantryId, testStockedItem, testDb);
    const stockedItemDocRef = doc(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`, docRef.id);
    const stockedItemDoc = await getDoc(stockedItemDocRef);

    expect(stockedItemDoc.exists()).toBe(true);
    expect(stockedItemDoc.data()).toMatchObject({
      householdId: householdId,
      pantryId: pantryId,
      brand: "brand1",
      category: "category1",
      expiryDate: "2023-12-31",
      location: "location1",
      name: "name1",
      quantity: 10
    });
  });

  test('getStockedItems retrieves all stocked item documents', async () => {
    const householdId = 'householdId1';
    const pantryId = 'pantryId1';
    await createDummyHousehold(householdId);
    await createDummyPantry(householdId, pantryId);

    const testStockedItem1 = new StockedItem(householdId, pantryId, "brand1", "category1", "2023-12-31", "location1", "name1", 10);
    const testStockedItem2 = new StockedItem(householdId, pantryId, "brand2", "category2", "2024-01-01", "location2", "name2", 20);

    await addDoc(collection(testDb, `households/${testStockedItem1.householdId}/pantry/${testStockedItem1.pantryId}/stocked_items`), {
      householdId: testStockedItem1.householdId,
      pantryId: testStockedItem1.pantryId,
      brand: testStockedItem1.brand,
      category: testStockedItem1.category,
      expiryDate: testStockedItem1.expiryDate,
      location: testStockedItem1.location,
      name: testStockedItem1.name,
      quantity: testStockedItem1.quantity
    });
    await addDoc(collection(testDb, `households/${testStockedItem2.householdId}/pantry/${testStockedItem2.pantryId}/stocked_items`), {
      householdId: testStockedItem2.householdId,
      pantryId: testStockedItem2.pantryId,
      brand: testStockedItem2.brand,
      category: testStockedItem2.category,
      expiryDate: testStockedItem2.expiryDate,
      location: testStockedItem2.location,
      name: testStockedItem2.name,
      quantity: testStockedItem2.quantity
    });

    const stockedItems = await StockedItem.getStockedItems(testStockedItem1.householdId, testStockedItem1.pantryId, testDb);

    expect(stockedItems.length).toBe(2);
  });

  test('getStockedItem retrieves a specific stocked item document', async () => {
    const householdId = 'householdId1';
    const pantryId = 'pantryId1';
    await createDummyHousehold(householdId);
    await createDummyPantry(householdId, pantryId);

    const testStockedItem = new StockedItem(householdId, pantryId, "brand1", "category1", "2023-12-31", "location1", "name1", 10);

    const docRef = await addDoc(collection(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`), {
      householdId: testStockedItem.householdId,
      pantryId: testStockedItem.pantryId,
      brand: testStockedItem.brand,
      category: testStockedItem.category,
      expiryDate: testStockedItem.expiryDate,
      location: testStockedItem.location,
      name: testStockedItem.name,
      quantity: testStockedItem.quantity
    });

    const stockedItem = await StockedItem.getStockedItem(testStockedItem.householdId, testStockedItem.pantryId, docRef.id, testDb);

    expect(stockedItem).toMatchObject({
      householdId: householdId,
      pantryId: pantryId,
      brand: "brand1",
      category: "category1",
      expiryDate: "2023-12-31",
      location: "location1",
      name: "name1",
      quantity: 10
    });
  });

  test('updateStockedItem updates an existing stocked item document', async () => {
    const householdId = 'householdId1';
    const pantryId = 'pantryId1';
    await createDummyHousehold(householdId);
    await createDummyPantry(householdId, pantryId);

    const testStockedItem = new StockedItem(householdId, pantryId, "brand1", "category1", "2023-12-31", "location1", "name1", 10);

    const docRef = await addDoc(collection(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`), {
      householdId: testStockedItem.householdId,
      pantryId: testStockedItem.pantryId,
      brand: testStockedItem.brand,
      category: testStockedItem.category,
      expiryDate: testStockedItem.expiryDate,
      location: testStockedItem.location,
      name: testStockedItem.name,
      quantity: testStockedItem.quantity
    });

    const updatedStockedItem = new StockedItem(householdId, pantryId, "brand2", "category2", "2024-01-01", "location2", "name2", 20);
    await StockedItem.updateStockedItem(testStockedItem.householdId, testStockedItem.pantryId, docRef.id, updatedStockedItem, testDb);

    const stockedItemDocRef = doc(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`, docRef.id);
    const stockedItemDoc = await getDoc(stockedItemDocRef);

    expect(stockedItemDoc.exists()).toBe(true);
    expect(stockedItemDoc.data()).toMatchObject({
      householdId: householdId,
      pantryId: pantryId,
      brand: "brand2",
      category: "category2",
      expiryDate: "2024-01-01",
      location: "location2",
      name: "name2",
      quantity: 20
    });
  });

  test('deleteStockedItem removes a stocked item document', async () => {
    const householdId = 'householdId1';
    const pantryId = 'pantryId1';
    await createDummyHousehold(householdId);
    await createDummyPantry(householdId, pantryId);

    const testStockedItem = new StockedItem(householdId, pantryId, "brand1", "category1", "2023-12-31", "location1", "name1", 10);

    const docRef = await addDoc(collection(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`), {
      householdId: testStockedItem.householdId,
      pantryId: testStockedItem.pantryId,
      brand: testStockedItem.brand,
      category: testStockedItem.category,
      expiryDate: testStockedItem.expiryDate,
      location: testStockedItem.location,
      name: testStockedItem.name,
      quantity: testStockedItem.quantity
    });

    await StockedItem.deleteStockedItem(testStockedItem.householdId, testStockedItem.pantryId, docRef.id, testDb);

    const stockedItemDocRef = doc(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`, docRef.id);
    const stockedItemDoc = await getDoc(stockedItemDocRef);

    expect(stockedItemDoc.exists()).toBe(false);
  });
});

// import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
// import { StockedItem } from '../../firebase/models/StockedItem.js';
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

// describe('StockedItem Model', () => {
//   test('createStockedItem creates a new stocked item document', async () => {
//     const testStockedItem = new StockedItem("householdId1", "pantryId1", "brand1", "category1", "2023-12-31", "location1", "name1", 10);

//     const docRef = await StockedItem.createStockedItem(testStockedItem.householdId, testStockedItem.pantryId, testStockedItem, testDb);
//     const stockedItemDocRef = doc(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`, docRef.id);
//     const stockedItemDoc = await getDoc(stockedItemDocRef);

//     expect(stockedItemDoc.exists()).toBe(true);
//     expect(stockedItemDoc.data()).toMatchObject({
//       householdId: "householdId1",
//       pantryId: "pantryId1",
//       brand: "brand1",
//       category: "category1",
//       expiryDate: "2023-12-31",
//       location: "location1",
//       name: "name1",
//       quantity: 10
//     });
//   });

//   test('getStockedItems retrieves all stocked item documents', async () => {
//     const testStockedItem1 = new StockedItem("householdId1", "pantryId1", "brand1", "category1", "2023-12-31", "location1", "name1", 10);
//     const testStockedItem2 = new StockedItem("householdId1", "pantryId1", "brand2", "category2", "2024-01-01", "location2", "name2", 20);

//     await addDoc(collection(testDb, `households/${testStockedItem1.householdId}/pantry/${testStockedItem1.pantryId}/stocked_items`), {
//       householdId: testStockedItem1.householdId,
//       pantryId: testStockedItem1.pantryId,
//       brand: testStockedItem1.brand,
//       category: testStockedItem1.category,
//       expiryDate: testStockedItem1.expiryDate,
//       location: testStockedItem1.location,
//       name: testStockedItem1.name,
//       quantity: testStockedItem1.quantity
//     });
//     await addDoc(collection(testDb, `households/${testStockedItem2.householdId}/pantry/${testStockedItem2.pantryId}/stocked_items`), {
//       householdId: testStockedItem2.householdId,
//       pantryId: testStockedItem2.pantryId,
//       brand: testStockedItem2.brand,
//       category: testStockedItem2.category,
//       expiryDate: testStockedItem2.expiryDate,
//       location: testStockedItem2.location,
//       name: testStockedItem2.name,
//       quantity: testStockedItem2.quantity
//     });

//     const stockedItems = await StockedItem.getStockedItems(testStockedItem1.householdId, testStockedItem1.pantryId, testDb);

//     expect(stockedItems.length).toBe(2);
//   });

//   test('getStockedItem retrieves a specific stocked item document', async () => {
//     const testStockedItem = new StockedItem("householdId1", "pantryId1", "brand1", "category1", "2023-12-31", "location1", "name1", 10);

//     const docRef = await addDoc(collection(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`), {
//       householdId: testStockedItem.householdId,
//       pantryId: testStockedItem.pantryId,
//       brand: testStockedItem.brand,
//       category: testStockedItem.category,
//       expiryDate: testStockedItem.expiryDate,
//       location: testStockedItem.location,
//       name: testStockedItem.name,
//       quantity: testStockedItem.quantity
//     });

//     const stockedItem = await StockedItem.getStockedItem(testStockedItem.householdId, testStockedItem.pantryId, docRef.id, testDb);

//     expect(stockedItem).toMatchObject({
//       householdId: "householdId1",
//       pantryId: "pantryId1",
//       brand: "brand1",
//       category: "category1",
//       expiryDate: "2023-12-31",
//       location: "location1",
//       name: "name1",
//       quantity: 10
//     });
//   });

//   test('updateStockedItem updates an existing stocked item document', async () => {
//     const testStockedItem = new StockedItem("householdId1", "pantryId1", "brand1", "category1", "2023-12-31", "location1", "name1", 10);

//     const docRef = await addDoc(collection(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`), {
//       householdId: testStockedItem.householdId,
//       pantryId: testStockedItem.pantryId,
//       brand: testStockedItem.brand,
//       category: testStockedItem.category,
//       expiryDate: testStockedItem.expiryDate,
//       location: testStockedItem.location,
//       name: testStockedItem.name,
//       quantity: testStockedItem.quantity
//     });

//     const updatedStockedItem = new StockedItem("householdId1", "pantryId1", "brand2", "category2", "2024-01-01", "location2", "name2", 20);
//     await StockedItem.updateStockedItem(testStockedItem.householdId, testStockedItem.pantryId, docRef.id, updatedStockedItem, testDb);

//     const stockedItemDocRef = doc(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`, docRef.id);
//     const stockedItemDoc = await getDoc(stockedItemDocRef);

//     expect(stockedItemDoc.exists()).toBe(true);
//     expect(stockedItemDoc.data()).toMatchObject({
//       householdId: "householdId1",
//       pantryId: "pantryId1",
//       brand: "brand2",
//       category: "category2",
//       expiryDate: "2024-01-01",
//       location: "location2",
//       name: "name2",
//       quantity: 20
//     });
//   });

//   test('deleteStockedItem removes a stocked item document', async () => {
//     const testStockedItem = new StockedItem("householdId1", "pantryId1", "brand1", "category1", "2023-12-31", "location1", "name1", 10);

//     const docRef = await addDoc(collection(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`), {
//       householdId: testStockedItem.householdId,
//       pantryId: testStockedItem.pantryId,
//       brand: testStockedItem.brand,
//       category: testStockedItem.category,
//       expiryDate: testStockedItem.expiryDate,
//       location: testStockedItem.location,
//       name: testStockedItem.name,
//       quantity: testStockedItem.quantity
//     });

//     await StockedItem.deleteStockedItem(testStockedItem.householdId, testStockedItem.pantryId, docRef.id, testDb);

//     const stockedItemDocRef = doc(testDb, `households/${testStockedItem.householdId}/pantry/${testStockedItem.pantryId}/stocked_items`, docRef.id);
//     const stockedItemDoc = await getDoc(stockedItemDocRef);

//     expect(stockedItemDoc.exists()).toBe(false);
//   });
// });