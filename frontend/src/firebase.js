
// 1. Import functions from Firebase library
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 2. Paste YOUR Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyCewIaV5saaba3x9t2l3ysu9VmJKu05fTc",
  authDomain: "constructiontracker-47962.firebaseapp.com",
  projectId: "constructiontracker-47962",
  storageBucket: "constructiontracker-47962.firebasestorage.app",
  messagingSenderId: "741852263072",
  appId: "1:741852263072:web:cc7daea998a910915c0fc5",
  measurementId: "G-SD31BLG6PC"
};

// 3. Initialize Firebase app (this connects your site to Firebase)
const app = initializeApp(firebaseConfig);

// 4. Get Firebase services
const auth = getAuth(app);       // for login
const db = getFirestore(app);    // for database
const storage = getStorage(app); // for image uploads later

// 5. Export them so other files can use
export { auth, db, storage };
