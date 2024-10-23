import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

class Pantry {
    constructor(id, householdId, category, name) {
        this.id = id;
        this.householdId = householdId;
        this.category = category;
        this.name = name;
    }

    static async createPantry(householdId, pantry) {
        const pantryCollection = collection(firestore, `households/${householdId}/pantry`);
        await addDoc(pantryCollection, {
            category: pantry.category,
            name: pantry.name
        });
    }

    static async getPantry(householdId, pantryId) {
        const pantryDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}`);
        const snapshot = await getDocs(pantryDoc);
        return new Pantry(snapshot.id, snapshot.data().category, snapshot.data().name);
    }

    static async getPantries(householdId) {
        const pantriesCollection = collection(firestore, `households/${householdId}/pantry`);
        const snapshot = await getDocs(pantriesCollection);
        return snapshot.docs.map(doc => new Pantry(doc.id, doc.data().category, doc.data().name));
    }

    static async updatePantry(householdId, pantryId, pantry) {
        const pantryDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}`);
        await updateDoc(pantryDoc, {
            category: pantry.category,
            name: pantry.name
        });
    }

    static async deletePantry(householdId, pantryId) {
        const pantryDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}`);
        await deleteDoc(pantryDoc);
    }

}