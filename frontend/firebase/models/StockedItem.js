import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

class StockedItem {
    constructor(householdId, pantryId, brand, category, expiryDate, location, name, quantity) {
        this.householdId = householdId;
        this.pantryId = pantryId;
        this.brand = brand;
        this.category = category;
        this.expiryDate = expiryDate;
        this.location = location;
        this.name = name;
        this.quantity = quantity;
    }

    static async addStockedItem(householdId, pantryId, stockedItem) {
        const stockedItemsCollection = collection(firestore, `households/${householdId}/pantry/${pantryId}/stocked_items`);
        await addDoc(stockedItemsCollection, {
            householdId: householdId,
            pantryId: pantryId,
            brand: stockedItem.brand,
            category: stockedItem.category,
            expiryDate: stockedItem.expiryDate,
            location: stockedItem.location,
            name: stockedItem.name,
            quantity: stockedItem.quantity
        });
    }

    static async getStockedItems(householdId, pantryId) {
        const stockedItemsCollection = collection(firestore, `households/${householdId}/pantry/${pantryId}/stocked_items`);
        const snapshot = await getDocs(stockedItemsCollection);
        return snapshot.docs.map(doc => new StockedItem(doc.data().householdId, doc.data().pantryId, doc.data().brand, doc.data().category, doc.data().expiryDate, doc.data().location, doc.data().name, doc.data().quantity));
    }

    static async getStockedItem(householdId, pantryId, stockedItemId) {
        const stockedItemDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}/stocked_items/${stockedItemId}`);
        const snapshot = await getDocs(stockedItemDoc);
        return new StockedItem(snapshot.data().householdId, snapshot.data().pantryId, snapshot.data().brand, snapshot.data().category, snapshot.data().expiryDate, snapshot.data().location, snapshot.data().name, snapshot.data().quantity);
    }

    static async updateStockedItem(householdId, pantryId, stockedItemId, stockedItem) {
        const stockedItemDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}/stocked_items/${stockedItemId}`);
        await updateDoc(stockedItemDoc, {
            householdId: householdId,
            pantryId: pantryId,
            brand: stockedItem.brand,
            category: stockedItem.category,
            expiryDate: stockedItem.expiryDate,
            location: stockedItem.location,
            name: stockedItem.name,
            quantity: stockedItem.quantity
        });
    }

    static async deleteStockedItem(householdId, pantryId, stockedItemId) {
        const stockedItemDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}/stocked_items/${stockedItemId}`);
        await deleteDoc(stockedItemDoc);
    }


}

export { StockedItem }