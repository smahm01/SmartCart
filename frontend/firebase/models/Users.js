import { firestore } from '../config';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

class User {
    constructor(name, email, phoneNumber, uid) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.uid = uid;
    }

    static async getUsers() {
        const usersCollection = collection(firestore, `users`);
        const snapshot = await getDocs(usersCollection);
        return snapshot.docs.map(doc => new User(doc.data().name, doc.data().email, doc.data.phoneNumber, doc.uid));
    }

    static async getUser(userId) {
        const userDoc = doc(firestore, `users/${userId}`);
        const snapshot = await getDocs(userDoc);
        return new User(snapshot.data().name, snapshot.data().email, doc.data().phoneNumber, doc.uid);
    }

    static async addUser(user, db = getFirestore()) {
        try {
            // Create a document reference with the user's UID
            const userDocRef = doc(db, 'users', user.uid);
            
            // Set the document data
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

    static async updateUser(userId, user) {
        const userDoc = doc(firestore, `users/${userId}`);
        await updateDoc(userDoc, {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            uid: user.uid
        });
    }

    static async deleteUser(userId) {
        const userDoc = doc(firestore, `users/${userId}`);
        await deleteDoc(userDoc);
    }
}


export { User };