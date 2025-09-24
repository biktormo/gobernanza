// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSmUnSnMPTOqiVj3xdCnF3a5peZpKB5fU",
  authDomain: "gobernanza-sartor.firebaseapp.com",
  projectId: "gobernanza-sartor",
  storageBucket: "gobernanza-sartor.firebasestorage.app",
  messagingSenderId: "652899984716",
  appId: "1:652899984716:web:80c19b82624daec450dbe9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que usaremos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);