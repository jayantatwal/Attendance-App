// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {

    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,


};


// Initialize Firebase
// This **initializes your Firebase app** with the configuration you get from the Firebase Console (API key, project ID, etc.).
const app = initializeApp(firebaseConfig);

// Export Firebase services
// You’ll use auth for things like:
// - Signing users up
// - Logging in
// - Logging out
// - Checking current user
const auth = getAuth(app);

// This gets the **Firestore Database instance** from your app.
// You’ll use `db` to:
// - Add data to Firestore
// - Read collections/documents
// - Update/delete documents
const db = getFirestore(app);

// This **exports `auth` and `db`**, so you can import them into other parts of your app.
export { auth, db, firebaseConfig };