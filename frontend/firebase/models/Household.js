import { firestore } from "../config";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

class Household {
  constructor(id = "", name = "", admins = [], people = []) {
    this.id = id;
    this.name = name;
    this.admins = admins;
    this.people = people;
  }

  // CREATE HOUSEHOLD METHODS

  /*
   * Creates a new household document in the firestore database
   * @param household - Household object to be created
   * @param userId - User id of the user creating the household (user reference will be added to the people & admin array)
   * @return - The reference to the newly created household document
   */
  static async createHousehold(household, userId) {
    const householdCollection = collection(firestore, `household`);
    const userCreatingHouseholdRef = doc(firestore, "users", userId);
    const householdDocRef = await addDoc(householdCollection, {
      name: household.name,
      admins: [userCreatingHouseholdRef],
      people: [userCreatingHouseholdRef],
    });
    return householdDocRef;
  }

  // GET HOUSEHOLD METHODS
  static async getHousehold(householdId) {
    const householdDoc = doc(firestore, `household/${householdId}`);
    const snapshot = await getDocs(householdDoc);
    return new Household(
      householdId,
      snapshot.data().name,
      snapshot.data().admins,
      snapshot.data().people
    );
  }

  /*
   * Returns all household documentsthat contain the user with userId in the people field array
   */
  static async getHouseholdsByUser(userId) {
    const householdsCollection = collection(firestore, "household");
    // Create user document reference so we can match on this in the people field in each household document
    const userDocRef = doc(firestore, "users", userId);

    // Construct query to check if the user is in the people array of any household document
    const q = query(
      householdsCollection,
      where("people", "array-contains", userDocRef)
    );

    // Execute query
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    } else {
      const households = snapshot.docs.map(
        (doc) =>
          new Household(
            doc.id,
            doc.data().name,
            doc.data().admins,
            doc.data().people
          )
      );
      return households;
    }
  }

  static async getHouseholds() {
    const householdsCollection = collection(firestore, `household`);
    const snapshot = await getDocs(householdsCollection);
    return snapshot.docs.map(
      (doc) =>
        new Household(
          doc.id,
          doc.data().name,
          doc.data().admins,
          doc.data().people
        )
    );
  }

  static async updateHousehold(householdId, household) {
    const householdDoc = doc(firestore, `household/${householdId}`);
    await updateDoc(householdDoc, {
      name: household.name,
      admins: household.admins,
      people: household.people,
    });
  }

  static async deleteHousehold(householdId) {
    const householdDoc = doc(firestore, `household/${householdId}`);
    await deleteDoc(householdDoc);
  }
}

export { Household };
