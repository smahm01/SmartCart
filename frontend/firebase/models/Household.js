import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";

class Household {
    constructor(name, admins = [], people = [], id = null) {
        this.name = name;
        this.admins = admins;
        this.people = people;
        this.id = id;
    }

    static async getHousehold(householdId, db = getFirestore()) {
        try {
            const householdDoc = doc(firestore, `households/${householdId}`);
            const snapshot = await getDocs(householdDoc);
            if (snapshot.exists()) {
                const household = new Household(snapshot.data().name, snapshot.data().admins, snapshot.data().people, snapshot.id);
                return household;
            } else {
                throw new Error('Household not found');
            }
        } catch (error) {
            console.error('Error getting household:', error);
            throw error;
        }
    }

    static async getHouseholds(db = getFirestore()) {
        try {
            const householdsCollection = collection(db, `households`);
            const snapshot = await getDocs(householdsCollection);
            if (snapshot.exists()) {
                const households = snapshot.docs.map(doc => new Household(doc.data().name, doc.data().admins, doc.data().people, doc.id));
                return households;
            } else {
                throw new Error('No households found');
            }
        } catch (error) {
            console.error('Error getting households:', error);
            throw error;
        }
    }
    

    static async createHousehold(household, db = getFirestore()) {
        try {
            const householdsCollectionRef = collection(db, 'households');
            await addDoc(householdsCollectionRef, {
                name: household.name,
                admins: household.admins,
                people: household.people
            });
            return {
                success: true,
            };
        } catch (error) {
            console.error('Error creating household:', error);
            throw error;
        }
    }

    static async updateHousehold(householdId, household, db = getFirestore()) {
        try {
            const householdDoc = doc(db, `households/${householdId}`);
            await updateDoc(householdDoc, {
                name: household.name,
                admins: household.admins,
                people: household.people
            }, { merge: true });
            return {
                success: true,
                householdId: household.id
            };
        } catch (error) {
            console.error('Error updating household:', error);
            throw error;
        }
        
    }

    static async deleteHousehold(householdId, db = getFirestore()) {
        try {
            const householdDoc = doc(db, `households/${householdId}`);
            await deleteDoc(householdDoc);
            return {
                success: true,
                householdId: householdId
            };
        } catch (error) {
            console.error('Error deleting household:', error);
            throw error;
        }
    }

}


export { Household };