import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

class ShoppingList {
    constructor(householdId, category, name) {
        this.householdId = householdId;
        this.category = category;
        this.name = name;
    }

    static async createShoppingList(householdId, shoppingList) {
        const shoppingListCollection = collection(firestore, `households/${householdId}/shopping_list`);
        await addDoc(shoppingListCollection, {
            householdId: householdId,
            category: shoppingList.category,
            name: shoppingList.name
        });
    }

    static async getShoppingList(householdId, shoppingListId) {
        const shoppingListDoc = doc(firestore, `households/${householdId}/shopping_list/${shoppingListId}`);
        const snapshot = await getDocs(shoppingListDoc);
        return new ShoppingList(householdId, snapshot.data().category, snapshot.data().name);
    }

    static async getShoppingLists(householdId) {
        const shoppingListsCollection = collection(firestore, `households/${householdId}/shopping_list`);
        const snapshot = await getDocs(shoppingListsCollection);
        return snapshot.docs.map(doc => new ShoppingList(householdId, doc.data().category, doc.data().name));
    }

    static async updateShoppingList(householdId, shoppingListId, shoppingList) {
        const shoppingListDoc = doc(firestore, `households/${householdId}/shopping_list/${shoppingListId}`);
        await updateDoc(shoppingListDoc, {
            householdId: householdId,
            category: shoppingList.category,
            name: shoppingList.name
        });
    }

    static async deleteShoppingList(householdId, shoppingListId) {
        const shoppingListDoc = doc(firestore, `households/${householdId}/shopping_list/${shoppingListId}`);
        await deleteDoc(shoppingListDoc);
    }
}

export { ShoppingList };