import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAWHwsVjuvIE3uH1_8bNANitlg6ILni26M",
    authDomain: "quail-d8fd3.firebaseapp.com",
    projectId: "quail-d8fd3",
    storageBucket: "quail-d8fd3.appspot.com",
    messagingSenderId: "44426776939",
    appId: "1:44426776939:web:3db3f2279e9bb7ccd83c2e"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()