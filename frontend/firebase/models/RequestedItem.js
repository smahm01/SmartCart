import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";

class RequestedItem {
    constructor(householdId, shoppingListId, category, dateRequested, itemRequester, location, name, quantityRequested, requestFullfilled, id = null) {
        this.householdId = householdId;
        this.shoppingListId = shoppingListId;
        this.category = category;
        this.dateRequested = dateRequested;
        this.itemRequester = itemRequester;
        this.location = location;
        this.name = name;
        this.quantityRequested = quantityRequested;
        this.requestFullfilled = requestFullfilled;
        this.id = id;
    }

    static async getRequestedItem(householdId, shoppingListId, requestedItemId, db = getFirestore()) {
        try {
            const requestedItemDoc = doc(db, `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`);
            const snapshot = await getDocs(requestedItemDoc);
            if (snapshot.exists()) {
                const requestedItem = new RequestedItem(
                    householdId,
                    shoppingListId,
                    snapshot.data().category,
                    snapshot.data().dateRequested,
                    snapshot.data().itemRequester,
                    snapshot.data().location,
                    snapshot.data().name,
                    snapshot.data().quantityRequested,
                    snapshot.data().requestFullfilled,
                    snapshot.id
                );
                return requestedItem;
            } else {
                throw new Error('Requested item not found');
            }
        } catch (error) {
            console.error('Error getting requested item:', error);
            throw error;
        }
    }

    static async getRequestedItems(householdId, shoppingListId, db = getFirestore()) {
        try {
            const requestedItemsCollection = collection(db, `households/${householdId}/shopping_list/${shoppingListId}/requested_items`);
            const snapshot = await getDocs(requestedItemsCollection);
            if (snapshot.exists()) {
                const requestedItems = snapshot.docs.map(doc => new RequestedItem(
                    householdId,
                    shoppingListId,
                    doc.data().category,
                    doc.data().dateRequested,
                    doc.data().itemRequester,
                    doc.data().location,
                    doc.data().name,
                    doc.data().quantityRequested,
                    doc.data().requestFullfilled,
                    doc.id
                ));
                return requestedItems;
            } else {
                throw new Error('No requested items found');
            }
        } catch (error) {
            console.error('Error getting requested items:', error);
            throw error;
        }
    }

    static async createRequestedItem(householdId, shoppingListId, requestedItem, db = getFirestore()) {
        try {
            const requestedItemsCollectionRef = collection(db, `households/${householdId}/shopping_list/${shoppingListId}/requested_items`);
            await addDoc(requestedItemsCollectionRef, {
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
            return {
                success: true,
            };
        } catch (error) {
            console.error('Error creating requested item:', error);
            throw error;
        }
    }

    static async updateRequestedItem(householdId, shoppingListId, requestedItemId, requestedItem, db = getFirestore()) {
        try {
            const requestedItemDoc = doc(db, `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`);
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
            }, { merge: true });
            return {
                success: true,
                requestedItemId: requestedItem.id
            };
        } catch (error) {
            console.error('Error updating requested item:', error);
            throw error;
        }
    }

    static async deleteRequestedItem(householdId, shoppingListId, requestedItemId, db = getFirestore()) {
        try {
            const requestedItemDoc = doc(db, `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`);
            await deleteDoc(requestedItemDoc);
            return {
                success: true,
                requestedItemId: requestedItemId
            };
        } catch (error) {
            console.error('Error deleting requested item:', error);
            throw error;
        }
    }
}

export { RequestedItem };

