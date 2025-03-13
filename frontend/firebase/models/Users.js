import { firestore } from "../config";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

class User {
  constructor(name, email, phoneNumber, uid, dietaryRestrictions = []) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.uid = uid;
    this.dietaryRestrictions = dietaryRestrictions;
  }

  static async getUser(userId, db = getFirestore()) {
    try {
      const userDoc = doc(db, `users/${userId}`);
      const snapshot = await getDoc(userDoc);
      if (snapshot.exists()) {
        const user = new User(
          snapshot.data().name,
          snapshot.data().email,
          snapshot.data().phoneNumber,
          snapshot.id,
          snapshot.data().dietaryRestrictions || []
        );
        return user;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  static async getUsers(db = getFirestore()) {
    try {
      const usersCollection = collection(db, `users`);
      const snapshot = await getDocs(usersCollection);
      if (!snapshot.empty) {
        const users = snapshot.docs.map(
          (doc) =>
            new User(
              doc.data().name,
              doc.data().email,
              doc.data().phoneNumber,
              doc.id,
              doc.data().dietaryRestrictions || []
            )
        );
        return users;
      } else {
        throw new Error("No users found");
      }
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  static async getUsersByName(searchName, db = getFirestore()) {
    if (searchName.length === 0) {
      return [];
    }

    try {
      const usersCollection = collection(db, `users`);
      const snapshot = await getDocs(usersCollection);
      if (!snapshot.empty) {
        const users = snapshot.docs
          .filter((doc) =>
            doc.data().name.toLowerCase().startsWith(searchName.toLowerCase())
          )
          .map(
            (doc) =>
              new User(
                doc.data().name,
                doc.data().email,
                doc.data().phoneNumber,
                doc.id,
                doc.data().dietaryRestrictions || []
              )
          );
        return users;
      } else {
        console.error("No users found");
        return [];
      }
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  static async createUser(user, db = getFirestore()) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        uid: user.uid,
        dietaryRestrictions: user.dietaryRestrictions
      });
      return {
        success: true,
        userId: user.uid,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async updateUser(userId, updatedUser, db = getFirestore()) {
    try {
      const userDoc = doc(db, `users/${userId}`);
      await updateDoc(userDoc, {
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        dietaryRestrictions: updatedUser.dietaryRestrictions
      });
      return {
        success: true,
        userId: userId,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async deleteUser(userId, db = getFirestore()) {
    try {
      const userDoc = doc(db, `users/${userId}`);
      await deleteDoc(userDoc);
      return {
        success: true,
        userId: userId,
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export { User };
