// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBiI4p2kCpfWUys5USnYKf8Y-EW890M17I",
    authDomain: "webconverter-c3376.firebaseapp.com",
    projectId: "webconverter-c3376",
    storageBucket: "webconverter-c3376.firebasestorage.app",
    messagingSenderId: "762739041249",
    appId: "1:762739041249:web:b2de9fd7951c3063b8e8a0",
    measurementId: "G-7JTY5GWKD4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);