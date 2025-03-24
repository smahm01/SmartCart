import { firestore } from "../config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { User } from "./Users";

class RequestedItem {
  constructor(
    householdId,
    shoppingListId,
    itemRequester,
    name,
    brand,
    categories = [],
    allergens = [],
    quantityRequested,
    requestFullfilled,
    dateRequested,
    productUpc,
    id = null
  ) {
    this.householdId = householdId;
    this.shoppingListId = shoppingListId;
    this.itemRequester = itemRequester;
    this.name = name;
    this.brand = brand;
    this.categories = categories;
    this.allergens = allergens;
    this.quantityRequested = quantityRequested;
    this.requestFullfilled = requestFullfilled;
    this.dateRequested = dateRequested;
    this.productUpc = productUpc;
    this.id = id;
  }

  static async getRequestedItem(
    householdId,
    shoppingListId,
    requestedItemId,
    db = getFirestore()
  ) {
    try {
      const requestedItemDoc = doc(
        db,
        `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`
      );
      const snapshot = await getDoc(requestedItemDoc);
      if (snapshot.exists()) {
        const requestedItem = new RequestedItem(
          householdId,
          shoppingListId,
          snapshot.data().itemRequester,
          snapshot.data().name,
          snapshot.data().brand,
          snapshot.data().categories,
          snapshot.data().allergens,
          snapshot.data().quantityRequested,
          snapshot.data().requestFullfilled,
          snapshot.data().dateRequested,
          snapshot.data().productUpc,
          snapshot.id
        );
        return requestedItem;
      } else {
        throw new Error("Requested item not found");
      }
    } catch (error) {
      console.error("Error getting requested item:", error);
      throw error;
    }
  }

  static async getRequestedItems(
    householdId,
    shoppingListId,
    db = getFirestore()
  ) {
    try {
      const requestedItemsCollection = collection(
        db,
        `households/${householdId}/shopping_list/${shoppingListId}/requested_items`
      );
      const snapshot = await getDocs(requestedItemsCollection);
      if (!snapshot.empty) {
        const requestedItems = snapshot.docs.map(
          (doc) =>
            new RequestedItem(
              householdId,
              shoppingListId,
              doc.data().itemRequester,
              doc.data().name,
              doc.data().brand,
              doc.data().categories,
              doc.data().allergens,
              doc.data().quantityRequested,
              doc.data().requestFullfilled,
              doc.data().dateRequested,
              doc.data().productUpc,
              doc.id
            )
        );
        return requestedItems;
      } else {
        return [];
      }
    } catch (error) {
      console.log("Error getting requested items:", error);
      throw error;
    }
  }

  static async createRequestedItem(
    householdId,
    shoppingListId,
    requestedItem,
    db = getFirestore()
  ) {
    try {
      const itemRequesterDoc = await User.getUser(requestedItem.itemRequester);
      const itemRequesterName = itemRequesterDoc.name;
      const requestedItemsCollectionRef = collection(
        db,
        `households/${householdId}/shopping_list/${shoppingListId}/requested_items`
      );
      const docRef = await addDoc(requestedItemsCollectionRef, {
        householdId: householdId,
        shoppingListId: shoppingListId,
        itemRequester: itemRequesterName,
        name: requestedItem.name,
        brand: requestedItem.brand,
        categories: requestedItem.categories,
        allergens: requestedItem.allergens,
        quantityRequested: requestedItem.quantityRequested,
        requestFullfilled: requestedItem.requestFullfilled,
        dateRequested: requestedItem.dateRequested,
        productUpc: requestedItem.productUpc,
      });
      return {
        success: true,
        id: docRef.id,
      };
    } catch (error) {
      console.error("Error creating requested item:", error);
      throw error;
    }
  }

  static async updateRequestedItem(
    householdId,
    shoppingListId,
    requestedItemId,
    requestedItem,
    db = getFirestore()
  ) {
    try {
      const requestedItemDoc = doc(
        db,
        `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`
      );
      await updateDoc(
        requestedItemDoc,
        {
          householdId: householdId,
          shoppingListId: shoppingListId,
          categories: requestedItem.categories,
          allergens: requestedItem.allergens,
          brand: requestedItem.brand,
          dateRequested: requestedItem.dateRequested,
          itemRequester: requestedItem.itemRequester,
          name: requestedItem.name,
          quantityRequested: requestedItem.quantityRequested,
          requestFullfilled: requestedItem.requestFullfilled,
        },
        { merge: true }
      );
      return {
        success: true,
        requestedItemId: requestedItem.id,
      };
    } catch (error) {
      console.error("Error updating requested item:", error);
      throw error;
    }
  }

  static async deleteRequestedItem(
    householdId,
    shoppingListId,
    requestedItemId,
    db = getFirestore()
  ) {
    try {
      const requestedItemDoc = doc(
        db,
        `households/${householdId}/shopping_list/${shoppingListId}/requested_items/${requestedItemId}`
      );
      await deleteDoc(requestedItemDoc);
      return {
        success: true,
        requestedItemId: requestedItemId,
      };
    } catch (error) {
      console.error("Error deleting requested item:", error);
      throw error;
    }
  }
}

export { RequestedItem };
