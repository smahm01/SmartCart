import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

class Pantry {
    constructor(householdId, category, name) {
        this.householdId = householdId;
        this.category = category;
        this.name = name;
    }

    static async createPantry(householdId, pantry) {
        const pantryCollection = collection(firestore, `households/${householdId}/pantry`);
        await addDoc(pantryCollection, {
            householdId: householdId,
            category: pantry.category,
            name: pantry.name
        });
    }

    static async getPantry(householdId, pantryId) {
        const pantryDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}`);
        const snapshot = await getDocs(pantryDoc);
        return new Pantry(householdId, snapshot.data().category, snapshot.data().name);
    }

    static async getPantries(householdId) {
        const pantriesCollection = collection(firestore, `households/${householdId}/pantry`);
        const snapshot = await getDocs(pantriesCollection);
        return snapshot.docs.map(doc => new Pantry(householdId, doc.data().category, doc.data().name));
    }

    static async updatePantry(householdId, pantryId, pantry) {
        const pantryDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}`);
        await updateDoc(pantryDoc, {
            householdId: householdId,
            category: pantry.category,
            name: pantry.name
        });
    }

    static async deletePantry(householdId, pantryId) {
        const pantryDoc = doc(firestore, `households/${householdId}/pantry/${pantryId}`);
        await deleteDoc(pantryDoc);
    }
}

export { Pantry };