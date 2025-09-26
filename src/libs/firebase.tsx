// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWzxioIawjpeyH94HXq3GDjWPw0KvGkcY",
  authDomain: "cristian-giuliani.firebaseapp.com",
  projectId: "cristian-giuliani",
  storageBucket: "cristian-giuliani.firebasestorage.app",
  messagingSenderId: "956703426361",
  appId: "1:956703426361:web:00a39759582dcfcab78ae8",
  measurementId: "G-G5R7Y1EP19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics };