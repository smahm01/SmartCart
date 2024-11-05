import { firestore } from '../config';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

class User {
    constructor(name, email, phoneNumber, uid) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.uid = uid;
    }

    static async getUsers(db = getFirestore()) {
        try {
            const usersCollection = collection(db, `users`);
            const snapshot = await getDocs(usersCollection);
            const users = snapshot.docs.map(doc => new User(doc.data().name, doc.data().email, doc.data().phoneNumber, doc.id));
            return {
                success: true,
                users: users
            };
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }

    static async getUser(userId, db = getFirestore()) {
        try {
            const userDoc = doc(db, `users/${userId}`);
            const snapshot = await getDoc(userDoc);
            if (snapshot.exists()) {
                const user = new User(snapshot.data().name, snapshot.data().email, snapshot.data().phoneNumber, snapshot.id);
                return {
                    success: true,
                    user: user
                };
            } else {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    static async addUser(user, db = getFirestore()) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                uid: user.uid
            });
            return {
                success: true,
                userId: user.uid
            };
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    static async updateUser(userId, user, db = getFirestore()) {
        try {
            const userDoc = doc(db, `users/${userId}`);
            await setDoc(userDoc, {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                uid: user.uid
            }, { merge: true });
            return {
                success: true,
                userId: userId
            };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async deleteUser(userId, db = getFirestore()) {
        try {
            const userDoc = doc(db, `users/${userId}`);
            await deleteDoc(userDoc);
            return {
                success: true,
                userId: userId
            };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

export { User };