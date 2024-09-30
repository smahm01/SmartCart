import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

class StockedItem {
    constructor(id, brand, category, expiryDate, location, name, quantity) {
        this.id = id;
        this.brand = brand;
        this.category = category;
        this.expiryDate = expiryDate;
        this.location = location;
        this.name = name;
        this.quantity = quantity;
    }
}

class RequestedItem {
    constructor(id, brand, category, dateRequested, itemRequester, expiryDate, location, name, quantityRequested, requestFullfilled) {
        this.id = id;
        this.brand = brand;
        this.category = category;
        this.dateRequested = dateRequested
        this.itemRequester = itemRequester;
        this.location = location;
        this.name = name;
        this.quantityRequested = quantityRequested;
        this.requestFullfilled = requestFullfilled;
    }
}

class ShoppingList {
    constructor(id, category, name) {
        this.id = id;
        this.category = category;
        this.name = name;
    }

    static async fetchItems(householdId, shoppingListId) {
        const itemsCollection = collection(firestore, `households/${householdId}/shopping_list/${shoppingListId}/requested_items`);
        const snapshot = await getDocs(itemsCollection);
        return snapshot.docs.map(doc => new RequestedItem(doc.id, doc.data().brand, doc.data().category, doc.data().dateRequested, doc.data().itemRequester, doc.data().expiryDate, doc.data().location, doc.data().name, doc.data().quantityRequested, doc.data().requestFullfilled));
    }

    static async addItem(householdId, shoppingListId, requestedItem) {
        const itemsCollection = collection(firestore, `households/${householdId}/shopping_list/${shoppingListId}/requested_items`);
        await addDoc(itemsCollection, {
            brand: requestedItem.brand,
            category: requestedItem.category,
            dateRequested: requestedItem.dateRequested,
            itemRequester: requestedItem.itemRequester,
            location: requestedItem.location,
            name: requestedItem.name,
            quantityRequested: requestedItem.quantityRequested,
            requestFullfilled: requestedItem.requestFullfilled
        });
    }

    // Similar methods for updateItem and deleteItem can be added here
}

class Pantry {
    constructor(id, category, name) {
        this.id = id;
        this.category = category;
        this.name = name;
    }

    static async fetchItems(householdId, pantryId) {
        const itemsCollection = collection(firestore, `households/${householdId}/pantry/${pantryId}/stocked_items`);
        const snapshot = await getDocs(itemsCollection);
        return snapshot.docs.map(doc => new StockedItem(doc.id, doc.data().brand, doc.data().category, doc.data().expiryDate, doc.data().location, doc.data().name, doc.data().quantity));
    }

    static async addItem(householdId, pantryId, item) {
        const itemsCollection = collection(firestore, `households/${householdId}/pantry/${pantryId}/stocked_items`);
        await addDoc(itemsCollection, {
            brand: item.brand,
            category: item.category,
            expiryDate: item.expiryDate,
            location: item.location,
            name: item.name,
            quantity: item.quantity
        });
    }

    // Similar methods for updateItem and deleteItem can be added here
}

class Household {
    constructor(id, name, admins = [], people = []) {
        this.id = id;
        this.name = name;
        this.admins = admins;
        this.people = people;
    }

    static async fetchHousehold(householdId) {
        const householdDoc = doc(firestore, `households/${householdId}`);
        const householdSnapshot = await getDoc(householdDoc);
        if (!householdSnapshot.exists()) {
            throw new Error('Household not found');
        }
        const data = householdSnapshot.data();
        const shoppingList = await ShoppingList.fetchItems(householdId, 'shopping_list');
        const stockedItems = await Pantry.fetchItems(householdId, 'stocked_items');
        return new Household(householdId, data.admins, data.people, shoppingList, stockedItems);
    }

    static async addHousehold(household) {
        const householdsCollection = collection(firestore, 'households');
        const householdDoc = await addDoc(householdsCollection, {
            admins: household.admins,
            people: household.people
        });
        household.id = householdDoc.id;
        
        const pantryCollection = collection(firestore, `households/${householdId}/pantry`);
        const pantryDoc = await addDoc(pantryCollection, {name: "Main Pantry", category: "Pantry"});
        
        return household;
    }

    //add shopping list
    static async addShoppingList(householdId, name, category) {
        const shoppingListCollection = collection(firestore, `households/${householdId}/shopping_list`);
        const shoppingListDoc = await addDoc(shoppingListCollection, {name: name, category: category});
        return shoppingListDoc.id;
    }

}


export { Household, ShoppingList, Pantry, StockedItem, RequestedItem };