import { firestore } from '../config';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";

class Pantry {
    constructor(householdId, category, name, id = null) {
        this.householdId = householdId;
        this.category = category;
        this.name = name;
        this.id = id;
    }

    static async getPantry(householdId, pantryId, db = getFirestore()) {
        try {
            const pantryDoc = doc(db, `households/${householdId}/pantry/${pantryId}`);
            const snapshot = await getDoc(pantryDoc);
            if (snapshot.exists()) {
                const pantry = new Pantry(householdId, snapshot.data().category, snapshot.data().name, snapshot.id);
                return pantry;
            } else {
                throw new Error('Pantry not found');
            }
        } catch (error) {
            console.error('Error getting pantry:', error);
            throw error;
        }
    }

    static async getPantries(householdId, db = getFirestore()) {
        try {
            const pantriesCollection = collection(db, `households/${householdId}/pantry`);
            const snapshot = await getDocs(pantriesCollection);
            if (!snapshot.empty) {
                const pantries = snapshot.docs.map(doc => new Pantry(householdId, doc.data().category, doc.data().name, doc.id));
                return pantries;
            } else {
                throw new Error('No pantries found');
            }
        } catch (error) {
            console.error('Error getting pantries:', error);
            throw error;
        }
    }

    static async createPantry(householdId, pantry, db = getFirestore()) {
        try {
            const pantriesCollectionRef = collection(db, `households/${householdId}/pantry`);
            const docRef = await addDoc(pantriesCollectionRef, {
                householdId: householdId,
                category: pantry.category,
                name: pantry.name
            });
            return {
                success: true,
                id: docRef.id
            };
        } catch (error) {
            console.error('Error creating pantry:', error);
            throw error;
        }
    }

    static async updatePantry(householdId, pantryId, pantry, db = getFirestore()) {
        try {
            const pantryDoc = doc(db, `households/${householdId}/pantry/${pantryId}`);
            await updateDoc(pantryDoc, {
                householdId: householdId,
                category: pantry.category,
                name: pantry.name
            }, { merge: true });
            return {
                success: true,
                pantryId: pantry.id
            };
        } catch (error) {
            console.error('Error updating pantry:', error);
            throw error;
        }
    }

    static async deletePantry(householdId, pantryId, db = getFirestore()) {
        try {
            const pantryDoc = doc(db, `households/${householdId}/pantry/${pantryId}`);
            await deleteDoc(pantryDoc);
            return {
                success: true,
                pantryId: pantryId
            };
        } catch (error) {
            console.error('Error deleting pantry:', error);
            throw error;
        }
    }
}

export { Pantry };
