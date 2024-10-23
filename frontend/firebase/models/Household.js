import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

class Household {
    constructor(id, name, admins = [], people = []) {
        this.id = id;
        this.name = name;
        this.admins = admins;
        this.people = people;
    }
    
    static async createHousehold(household) {
        const householdCollection = collection(firestore, `households`);
        await addDoc(householdCollection, {
            name: household.name,
            admins: household.admins,
            people: household.people
        });
    }

    static async getHousehold(householdId) {
        const householdDoc = doc(firestore, `households/${householdId}`);
        const snapshot = await getDocs(householdDoc);
        return new Household(householdId, snapshot.data().name, snapshot.data().admins, snapshot.data().people);
    }

    static async getHouseholds() {
        const householdsCollection = collection(firestore, `households`);
        const snapshot = await getDocs(householdsCollection);
        return snapshot.docs.map(doc => new Household(doc.id, doc.data().name, doc.data().admins, doc.data().people));
    }

    static async updateHousehold(householdId, household) {
        const householdDoc = doc(firestore, `households/${householdId}`);
        await updateDoc(householdDoc, {
            name: household.name,
            admins: household.admins,
            people: household.people
        });
    }

    static async deleteHousehold(householdId) {
        const householdDoc = doc(firestore, `households/${householdId}`);
        await deleteDoc(householdDoc);
    }

}


export { Household };