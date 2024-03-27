// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbW1BC50qOko6NhL7M6hKpsdTZhr0h7O8",
    authDomain: "sheridanschedule-40fad.firebaseapp.com",
    projectId: "sheridanschedule-40fad",
    storageBucket: "sheridanschedule-40fad.appspot.com",
    messagingSenderId: "359840747023",
    appId: "1:359840747023:web:b1e44bbbdba02d180e9d7a",
    measurementId: "G-25EBLBV3VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Firebase
const auth = getAuth(app);

// Export the Firebase Auth and Firestore instances
export { db, auth };