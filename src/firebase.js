// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDolSjugFljixoR7aZMMqJsTKQhIRLH62A",
  authDomain: "yuchi-petfinder-app.firebaseapp.com",
  projectId: "yuchi-petfinder-app",
  storageBucket: "yuchi-petfinder-app.appspot.com",
  messagingSenderId: "844879274952",
  appId: "1:844879274952:web:66d595186ecd2e7f8a16fd",
  measurementId: "G-YYE306NEX4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
