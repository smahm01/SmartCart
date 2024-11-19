import { firestore } from '../config';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";

class StockedItem {
    constructor(householdId, pantryId, brand, category, expiryDate, location, name, quantity, id = null) {
        this.householdId = householdId;
        this.pantryId = pantryId;
        this.brand = brand;
        this.category = category;
        this.expiryDate = expiryDate;
        this.location = location;
        this.name = name;
        this.quantity = quantity;
        this.id = id;
    }

    static async getStockedItem(householdId, pantryId, stockedItemId, db = getFirestore()) {
        try {
            const stockedItemDoc = doc(db, `households/${householdId}/pantry/${pantryId}/stocked_items/${stockedItemId}`);
            const snapshot = await getDoc(stockedItemDoc);
            if (snapshot.exists()) {
                const stockedItem = new StockedItem(
                    householdId,
                    pantryId,
                    snapshot.data().brand,
                    snapshot.data().category,
                    snapshot.data().expiryDate,
                    snapshot.data().location,
                    snapshot.data().name,
                    snapshot.data().quantity,
                    snapshot.id
                );
                return stockedItem;
            } else {
                throw new Error('Stocked item not found');
            }
        } catch (error) {
            console.error('Error getting stocked item:', error);
            throw error;
        }
    }

    static async getStockedItems(householdId, pantryId, db = getFirestore()) {
        try {
            const stockedItemsCollection = collection(db, `households/${householdId}/pantry/${pantryId}/stocked_items`);
            const snapshot = await getDocs(stockedItemsCollection);
            if (!snapshot.empty) {
                const stockedItems = snapshot.docs.map(doc => new StockedItem(
                    householdId,
                    pantryId,
                    doc.data().brand,
                    doc.data().category,
                    doc.data().expiryDate,
                    doc.data().location,
                    doc.data().name,
                    doc.data().quantity,
                    doc.id
                ));
                return stockedItems;
            } else {
                throw new Error('No stocked items found');
            }
        } catch (error) {
            console.error('Error getting stocked items:', error);
            throw error;
        }
    }

    static async createStockedItem(householdId, pantryId, stockedItem, db = getFirestore()) {
        try {
            const stockedItemsCollectionRef = collection(db, `households/${householdId}/pantry/${pantryId}/stocked_items`);
            const docRef = await addDoc(stockedItemsCollectionRef, {
                householdId: householdId,
                pantryId: pantryId,
                brand: stockedItem.brand,
                category: stockedItem.category,
                expiryDate: stockedItem.expiryDate,
                location: stockedItem.location,
                name: stockedItem.name,
                quantity: stockedItem.quantity
            });
            return {
                success: true,
                id: docRef.id
            };
        } catch (error) {
            console.error('Error creating stocked item:', error);
            throw error;
        }
    }

    static async updateStockedItem(householdId, pantryId, stockedItemId, stockedItem, db = getFirestore()) {
        try {
            const stockedItemDoc = doc(db, `households/${householdId}/pantry/${pantryId}/stocked_items/${stockedItemId}`);
            await updateDoc(stockedItemDoc, {
                householdId: householdId,
                pantryId: pantryId,
                brand: stockedItem.brand,
                category: stockedItem.category,
                expiryDate: stockedItem.expiryDate,
                location: stockedItem.location,
                name: stockedItem.name,
                quantity: stockedItem.quantity
            }, { merge: true });
            return {
                success: true,
                stockedItemId: stockedItem.id
            };
        } catch (error) {
            console.error('Error updating stocked item:', error);
            throw error;
        }
    }

    static async deleteStockedItem(householdId, pantryId, stockedItemId, db = getFirestore()) {
        try {
            const stockedItemDoc = doc(db, `households/${householdId}/pantry/${pantryId}/stocked_items/${stockedItemId}`);
            await deleteDoc(stockedItemDoc);
            return {
                success: true,
                stockedItemId: stockedItemId
            };
        } catch (error) {
            console.error('Error deleting stocked item:', error);
            throw error;
        }
    }
}

export { StockedItem };
