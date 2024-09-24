import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig, app, firestore } from "./config.js";


const addDocument = async (collectionName, docData) => {
    try {
        await addDoc(collection(firestore, collectionName), docData);
        console.log('Document successfully written!');
    } catch (error) {
        console.error('Error writing document: ', error);
    }
};

const getDocuments = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(firestore, collectionName));
        const docs = querySnapshot.docs.map(doc => doc.data());
        console.log('Documents: ', docs);
        return docs;
    } catch (error) {
        console.error('Error getting documents: ', error);
    }
};

export { addDocument, getDocuments };