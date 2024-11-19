import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { RequestedItem } from '../../firebase/models/RequestedItem.js';
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

describe('RequestedItem Model', () => {
  const createDummyHousehold = async (householdId) => {
    await addDoc(collection(testDb, 'households'), {
      id: householdId,
      name: `Household ${householdId}`,
      admins: ['admin1'],
      people: ['person1', 'person2']
    });
  };

  const createDummyShoppingList = async (householdId, shoppingListId) => {
    await addDoc(collection(testDb, `households/${householdId}/shopping_list`), {
      id: shoppingListId,
      category: `Category ${shoppingListId}`,
      name: `Shopping List ${shoppingListId}`
    });
  };

  test('createRequestedItem creates a new requested item document', async () => {
    const householdId = 'householdId1';
    const shoppingListId = 'shoppingListId1';
    await createDummyHousehold(householdId);
    await createDummyShoppingList(householdId, shoppingListId);

    const testRequestedItem = new RequestedItem(householdId, shoppingListId, "category1", "2023-12-31", "requester1", "location1", "name1", 10, false);

    const docRef = await RequestedItem.createRequestedItem(testRequestedItem.householdId, testRequestedItem.shoppingListId, testRequestedItem, testDb);
    const requestedItemDocRef = doc(testDb, `households/${testRequestedItem.householdId}/shopping_list/${testRequestedItem.shoppingListId}/requested_items`, docRef.id);
    const requestedItemDoc = await getDoc(requestedItemDocRef);

    expect(requestedItemDoc.exists()).toBe(true);
    expect(requestedItemDoc.data()).toMatchObject({
      householdId: householdId,
      shoppingListId: shoppingListId,
      category: "category1",
      dateRequested: "2023-12-31",
      itemRequester: "requester1",
      location: "location1",
      name: "name1",
      quantityRequested: 10,
      requestFullfilled: false
    });
  });

  test('getRequestedItems retrieves all requested item documents', async () => {
    const householdId = 'householdId1';
    const shoppingListId = 'shoppingListId1';
    await createDummyHousehold(householdId);
    await createDummyShoppingList(householdId, shoppingListId);

    const testRequestedItem1 = new RequestedItem(householdId, shoppingListId, "category1", "2023-12-31", "requester1", "location1", "name1", 10, false);
    const testRequestedItem2 = new RequestedItem(householdId, shoppingListId, "category2", "2024-01-01", "requester2", "location2", "name2", 20, true);

    await addDoc(collection(testDb, `households/${testRequestedItem1.householdId}/shopping_list/${testRequestedItem1.shoppingListId}/requested_items`), {
      householdId: testRequestedItem1.householdId,
      shoppingListId: testRequestedItem1.shoppingListId,
      category: testRequestedItem1.category,
      dateRequested: testRequestedItem1.dateRequested,
      itemRequester: testRequestedItem1.itemRequester,
      location: testRequestedItem1.location,
      name: testRequestedItem1.name,
      quantityRequested: testRequestedItem1.quantityRequested,
      requestFullfilled: testRequestedItem1.requestFullfilled
    });
    await addDoc(collection(testDb, `households/${testRequestedItem2.householdId}/shopping_list/${testRequestedItem2.shoppingListId}/requested_items`), {
      householdId: testRequestedItem2.householdId,
      shoppingListId: testRequestedItem2.shoppingListId,
      category: testRequestedItem2.category,
      dateRequested: testRequestedItem2.dateRequested,
      itemRequester: testRequestedItem2.itemRequester,
      location: testRequestedItem2.location,
      name: testRequestedItem2.name,
      quantityRequested: testRequestedItem2.quantityRequested,
      requestFullfilled: testRequestedItem2.requestFullfilled
    });

    const requestedItems = await RequestedItem.getRequestedItems(testRequestedItem1.householdId, testRequestedItem1.shoppingListId, testDb);

    expect(requestedItems.length).toBe(2);
  });

  test('getRequestedItem retrieves a specific requested item document', async () => {
    const householdId = 'householdId1';
    const shoppingListId = 'shoppingListId1';
    await createDummyHousehold(householdId);
    await createDummyShoppingList(householdId, shoppingListId);

    const testRequestedItem = new RequestedItem(householdId, shoppingListId, "category1", "2023-12-31", "requester1", "location1", "name1", 10, false);

    const docRef = await addDoc(collection(testDb, `households/${testRequestedItem.householdId}/shopping_list/${testRequestedItem.shoppingListId}/requested_items`), {
      householdId: testRequestedItem.householdId,
      shoppingListId: testRequestedItem.shoppingListId,
      category: testRequestedItem.category,
      dateRequested: testRequestedItem.dateRequested,
      itemRequester: testRequestedItem.itemRequester,
      location: testRequestedItem.location,
      name: testRequestedItem.name,
      quantityRequested: testRequestedItem.quantityRequested,
      requestFullfilled: testRequestedItem.requestFullfilled
    });

    const requestedItem = await RequestedItem.getRequestedItem(testRequestedItem.householdId, testRequestedItem.shoppingListId, docRef.id, testDb);

    expect(requestedItem).toMatchObject({
      householdId: householdId,
      shoppingListId: shoppingListId,
      category: "category1",
      dateRequested: "2023-12-31",
      itemRequester: "requester1",
      location: "location1",
      name: "name1",
      quantityRequested: 10,
      requestFullfilled: false
    });
  });

  test('updateRequestedItem updates an existing requested item document', async () => {
    const householdId = 'householdId1';
    const shoppingListId = 'shoppingListId1';
    await createDummyHousehold(householdId);
    await createDummyShoppingList(householdId, shoppingListId);

    const testRequestedItem = new RequestedItem(householdId, shoppingListId, "category1", "2023-12-31", "requester1", "location1", "name1", 10, false);

    const docRef = await addDoc(collection(testDb, `households/${testRequestedItem.householdId}/shopping_list/${testRequestedItem.shoppingListId}/requested_items`), {
      householdId: testRequestedItem.householdId,
      shoppingListId: testRequestedItem.shoppingListId,
      category: testRequestedItem.category,
      dateRequested: testRequestedItem.dateRequested,
      itemRequester: testRequestedItem.itemRequester,
      location: testRequestedItem.location,
      name: testRequestedItem.name,
      quantityRequested: testRequestedItem.quantityRequested,
      requestFullfilled: testRequestedItem.requestFullfilled
    });

    const updatedRequestedItem = new RequestedItem(householdId, shoppingListId, "category2", "2024-01-01", "requester2", "location2", "name2", 20, true);
    await RequestedItem.updateRequestedItem(testRequestedItem.householdId, testRequestedItem.shoppingListId, docRef.id, updatedRequestedItem, testDb);

    const requestedItemDocRef = doc(testDb, `households/${testRequestedItem.householdId}/shopping_list/${testRequestedItem.shoppingListId}/requested_items`, docRef.id);
    const requestedItemDoc = await getDoc(requestedItemDocRef);

    expect(requestedItemDoc.exists()).toBe(true);
    expect(requestedItemDoc.data()).toMatchObject({
      householdId: householdId,
      shoppingListId: shoppingListId,
      category: "category2",
      dateRequested: "2024-01-01",
      itemRequester: "requester2",
      location: "location2",
      name: "name2",
      quantityRequested: 20,
      requestFullfilled: true
    });
  });

  test('deleteRequestedItem removes a requested item document', async () => {
    const householdId = 'householdId1';
    const shoppingListId = 'shoppingListId1';
    await createDummyHousehold(householdId);
    await createDummyShoppingList(householdId, shoppingListId);

    const testRequestedItem = new RequestedItem(householdId, shoppingListId, "category1", "2023-12-31", "requester1", "location1", "name1", 10, false);

    const docRef = await addDoc(collection(testDb, `households/${testRequestedItem.householdId}/shopping_list/${testRequestedItem.shoppingListId}/requested_items`), {
      householdId: testRequestedItem.householdId,
      shoppingListId: testRequestedItem.shoppingListId,
      category: testRequestedItem.category,
      dateRequested: testRequestedItem.dateRequested,
      itemRequester: testRequestedItem.itemRequester,
      location: testRequestedItem.location,
      name: testRequestedItem.name,
      quantityRequested: testRequestedItem.quantityRequested,
      requestFullfilled: testRequestedItem.requestFullfilled
    });

    await RequestedItem.deleteRequestedItem(testRequestedItem.householdId, testRequestedItem.shoppingListId, docRef.id, testDb);

    const requestedItemDocRef = doc(testDb, `households/${testRequestedItem.householdId}/shopping_list/${testRequestedItem.shoppingListId}/requested_items`, docRef.id);
    const requestedItemDoc = await getDoc(requestedItemDocRef);

    expect(requestedItemDoc.exists()).toBe(false);
  });
});