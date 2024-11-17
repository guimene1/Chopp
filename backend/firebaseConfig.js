import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDkCoNlzFAcGIVax7ElSGcqh1Yzy8f5M7Q",
  authDomain: "berrmapper.firebaseapp.com",
  projectId: "berrmapper",
  storageBucket: "berrmapper.firebasestorage.app",
  messagingSenderId: "543205407190",
  appId: "1:543205407190:web:3a1bf8a8ac812138898c77",
  measurementId: "G-KLZK4NME4V"
};

// Inicializando o Firebase App, Firestore, Auth e Storage
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, createUserWithEmailAndPassword, signInWithEmailAndPassword };
