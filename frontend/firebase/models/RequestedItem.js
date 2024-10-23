import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

class RequestedItem {
    constructor(householdId, shoppingListId, category, name) {
        this.householdId = householdId;
        this.shoppingListId = shoppingListId;
        this.category = category;
        this.dateRequested = dateRequested
        this.itemRequester = itemRequester;
        this.location = location;
        this.name = name;
        this.quantityRequested = quantityRequested;
        this.requestFullfilled = requestFullfilled;
    }

    static async addRequestedItem(householdId, shoppingListId, requestedItem) {
        const requestedItemsCollection = collection(firestore, `households/${householdId}/shopping_list/${shoppingListId}/requested_items`);
        await addDoc(requestedItemsCollection, {
            householdId: householdId,
            shoppingListId: shoppingListId,
            category: requestedItem.category,
            dateRequested: requestedItem.dateRequested,
            itemRequester: requestedItem.itemRequester,
            location: requestedItem.location,
            name: requestedItem.name,
            quantityRequested: requestedItem.quantityRequested,
            requestFullfilled: requestedItem.requestFullfilled
        });
    }

    static async getRequestedItems(householdId, shoppingListId) {
        const requestedItemsCollection = collection(firestore, `households/${householdId}/shopping_list/${shoppingListId}/requested_items`);
        const snapshot = await getDocs(requestedItemsCollection);
        return snapshot.docs.map(doc => new RequestedItem(householdId, shoppingListId, doc.data().category, doc.data().name));
    }

    static async getRequestedItem(householdId, shoppingListId, requestedItemId) {
        const requestedItemDoc = doc(firestore, `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`);
        const snapshot = await getDocs(requestedItemDoc);
        return new RequestedItem(householdId, shoppingListId, snapshot.data().category, snapshot.data().name);
    }

    static async updateRequestedItem(householdId, shoppingListId, requestedItemId, requestedItem) {
        const requestedItemDoc = doc(firestore, `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`);
        await updateDoc(requestedItemDoc, {
            householdId: householdId,
            shoppingListId: shoppingListId,
            category: requestedItem.category,
            dateRequested: requestedItem.dateRequested,
            itemRequester: requestedItem.itemRequester,
            location: requestedItem.location,
            name: requestedItem.name,
            quantityRequested: requestedItem.quantityRequested,
            requestFullfilled: requestedItem.requestFullfilled
        });
    }

    static async deleteRequestedItem(householdId, shoppingListId, requestedItemId) {
        const requestedItemDoc = doc(firestore, `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`);
        await deleteDoc(requestedItemDoc);
    }
}

export { RequestedItem };