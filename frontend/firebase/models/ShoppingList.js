import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";

class ShoppingList {
    constructor(householdId, category, name, id = null) {
        this.householdId = householdId;
        this.category = category;
        this.name = name;
        this.id = id;
    }

    static async getShoppingList(householdId, shoppingListId, db = getFirestore()) {
        try {
            const shoppingListDoc = doc(db, `households/${householdId}/shopping_list/${shoppingListId}`);
            const snapshot = await getDocs(shoppingListDoc);
            if (snapshot.exists()) {
                const shoppingList = new ShoppingList(householdId, snapshot.data().category, snapshot.data().name, snapshot.id);
                return shoppingList;
            } else {
                throw new Error('Shopping list not found');
            }
        } catch (error) {
            console.error('Error getting shopping list:', error);
            throw error;
        }
    }

    static async getShoppingLists(householdId, db = getFirestore()) {
        try {
            const shoppingListsCollection = collection(db, `households/${householdId}/shopping_list`);
            const snapshot = await getDocs(shoppingListsCollection);
            if (snapshot.exists()) {
                const shoppingLists = snapshot.docs.map(doc => new ShoppingList(householdId, doc.data().category, doc.data().name, doc.id));
                return shoppingLists;
            } else {
                throw new Error('No shopping lists found');
            }
        } catch (error) {
            console.error('Error getting shopping lists:', error);
            throw error;
        }
    }

    static async createShoppingList(householdId, shoppingList, db = getFirestore()) {
        try {
            const shoppingListsCollectionRef = collection(db, `households/${householdId}/shopping_list`);
            await addDoc(shoppingListsCollectionRef, {
                householdId: householdId,
                category: shoppingList.category,
                name: shoppingList.name
            });
            return {
                success: true,
            };
        } catch (error) {
            console.error('Error creating shopping list:', error);
            throw error;
        }
    }

    static async updateShoppingList(householdId, shoppingListId, shoppingList, db = getFirestore()) {
        try {
            const shoppingListDoc = doc(db, `households/${householdId}/shopping_list/${shoppingListId}`);
            await updateDoc(shoppingListDoc, {
                householdId: householdId,
                category: shoppingList.category,
                name: shoppingList.name
            }, { merge: true });
            return {
                success: true,
                shoppingListId: shoppingList.id
            };
        } catch (error) {
            console.error('Error updating shopping list:', error);
            throw error;
        }
    }

    static async deleteShoppingList(householdId, shoppingListId, db = getFirestore()) {
        try {
            const shoppingListDoc = doc(db, `households/${householdId}/shopping_list/${shoppingListId}`);
            await deleteDoc(shoppingListDoc);
            return {
                success: true,
                shoppingListId: shoppingListId
            };
        } catch (error) {
            console.error('Error deleting shopping list:', error);
            throw error;
        }
    }
}

export { ShoppingList };
