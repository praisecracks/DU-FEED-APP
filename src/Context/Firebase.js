// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
// // Initialize Firebase
// const firebaseConfig = {
//   apiKey:"AIzaSyAkntOz7mgnHViW7hYwG9OFi9EzAtV7SoM",
//   authDomain:"findme-fuoye.firebaseapp.com",
//   projectId:"findme-fuoye",
//   storageBucket:"findme-fuoye.appspot.com",
//   messagingSenderId:"210780144018",
//   appId:"1:210780144018:web:51ee1081b990974439014b",
//   measurementId:"G-P3WT478E7J",
// };

// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth();
// export const storage = getStorage();
// export const db = getFirestore();


import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyAmS4XHfh9Jlx5ByvCPTb14LgBnznfDXBo",
  authDomain: "clone-8e729.firebaseapp.com",
  projectId: "clone-8e729",
  storageBucket: "clone-8e729.appspot.com",
  messagingSenderId: "800320267053",
  appId: "1:800320267053:web:674ebd5dbfd2859bff69a4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()



