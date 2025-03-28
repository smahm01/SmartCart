import { firestore } from '../config';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, getFirestore, DocumentReference } from "firebase/firestore";
import { auth } from '../config';

class Household {
    constructor(name, admins = [], people = [], id = null) {
        this.name = name;
        this.admins = admins;
        this.people = people;
        this.id = id;
    }

    static async getHousehold(householdId, db = getFirestore()) {
        try {
            const householdDoc = doc(db, `households/${householdId}`);
            const snapshot = await getDoc(householdDoc);
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
            const householdsCollection = collection(db, 'households');
            const snapshot = await getDocs(householdsCollection);
            if (!snapshot.empty) {
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
            const docRef = await addDoc(householdsCollectionRef, {
                name: household.name,
                admins: household.admins,
                people: household.people
            });
            return {
                success: true,
                id: docRef.id
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
                        doc.data().name,
                        doc.data().admins,
                        doc.data().people,
                        doc.id
                    )
            );
            return households;
        }
    }

    static async isUserAdminOfHousehold(
      userId,
      householdId,
      db = getFirestore()
    ) {
      try {
        const householdDocRef = doc(db, `households/${householdId}`);
  
        const householdDoc = await getDoc(householdDocRef);
        if (householdDoc.exists()) {
          const admins = householdDoc.data().admins;
  
          const adminMatch = admins.some((admin) => admin.id === userId);
  
          if (adminMatch) {
            return true;
          } else {
            return false;
          }
        }
      } catch (error) {
        console.error("Error getting household:", error);
        throw error;
      }
    }

    static async removeMember(householdId, userId, db = getFirestore()) {
      try {
        const householdDocRef = doc(db, `households/${householdId}`);
        const userDocRef = doc(db, `users/${userId}`);
        
        const householdDoc = await getDoc(householdDocRef);
        if (!householdDoc.exists()) {
          throw new Error('Household not found');
        }

        const householdData = householdDoc.data();
        const people = householdData.people || [];
        const admins = householdData.admins || [];
        
        // Check if the current user is an admin
        const currentUserId = auth.currentUser.uid;
        const isCurrentUserAdmin = admins.some(adminRef => adminRef.id === currentUserId);
        if (!isCurrentUserAdmin) {
          throw new Error('Only administrators can remove members');
        }

        // Remove user from both people and admins arrays
        const updatedPeople = people.filter(person => person.id !== userId);
        const updatedAdmins = admins.filter(admin => admin.id !== userId);

        // Update the household document
        await updateDoc(householdDocRef, {
          people: updatedPeople,
          admins: updatedAdmins
        });

        return {
          success: true,
          householdId: householdId
        };
      } catch (error) {
        console.error('Error removing member:', error);
        throw error;
      }
    }

    static async promoteToAdmin(householdId, userId, db = getFirestore()) {
      try {
        const householdDocRef = doc(db, `households/${householdId}`);
        const userDocRef = doc(db, `users/${userId}`);
        
        const householdDoc = await getDoc(householdDocRef);
        if (!householdDoc.exists()) {
          throw new Error('Household not found');
        }

        const householdData = householdDoc.data();
        const people = householdData.people || [];
        const admins = householdData.admins || [];
        
        // Check if the current user is an admin
        const currentUserId = auth.currentUser.uid;
        const isCurrentUserAdmin = admins.some(adminRef => adminRef.id === currentUserId);
        if (!isCurrentUserAdmin) {
          throw new Error('Only administrators can promote members to admin');
        }

        // Check if user is already an admin
        if (admins.some(adminRef => adminRef.id === userId)) {
          throw new Error('User is already an admin');
        }

        // Add user to admins array
        const updatedAdmins = [...admins, userDocRef];

        // Update the household document
        await updateDoc(householdDocRef, {
          admins: updatedAdmins
        });

        return {
          success: true,
          householdId: householdId
        };
      } catch (error) {
        console.error('Error promoting member:', error);
        throw error;
      }
    }

    static async demoteFromAdmin(householdId, userId, db = getFirestore()) {
      try {
        const householdDocRef = doc(db, `households/${householdId}`);
        const userDocRef = doc(db, `users/${userId}`);
        
        const householdDoc = await getDoc(householdDocRef);
        if (!householdDoc.exists()) {
          throw new Error('Household not found');
        }

        const householdData = householdDoc.data();
        const admins = householdData.admins || [];
        
        // Check if the current user is an admin
        const currentUserId = auth.currentUser.uid;
        const isCurrentUserAdmin = admins.some(adminRef => adminRef.id === currentUserId);
        if (!isCurrentUserAdmin) {
          throw new Error('Only administrators can demote admins');
        }

        // Check if user is an admin
        if (!admins.some(adminRef => adminRef.id === userId)) {
          throw new Error('User is not an admin');
        }

        // Remove user from admins array
        const updatedAdmins = admins.filter(admin => admin.id !== userId);

        // Update the household document
        await updateDoc(householdDocRef, {
          admins: updatedAdmins
        });

        return {
          success: true,
          householdId: householdId
        };
      } catch (error) {
        console.error('Error demoting admin:', error);
        throw error;
      }
    }
}

export { Household };
