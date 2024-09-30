import { firestore } from '../config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    static async fetchUsers() {
        const usersCollection = collection(firestore, `users`);
        const snapshot = await getDocs(usersCollection);
        return snapshot.docs.map(doc => new User(doc.id, doc.data().name, doc.data().email));
    }

    static async addUser(user) {
        const usersCollection = collection(firestore, `users`);
        await addDoc(usersCollection, {
            name: user.name,
            email: user.email,
        });
    }
}


export { User };