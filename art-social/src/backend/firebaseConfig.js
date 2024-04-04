/*
Get this from Firebase app settings
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbEC6i_s4WzKPXF7VTqbZ1W2VF7uKdNWA",
  authDomain: "artsync-940c4.firebaseapp.com",
  projectId: "artsync-940c4",
  storageBucket: "artsync-940c4.appspot.com",
  messagingSenderId: "464613331528",
  appId: "1:464613331528:web:b105b2d9ff724c25ba7e7d",
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;
