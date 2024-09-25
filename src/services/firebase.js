// Importa las funciones necesarias desde el SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDT01NXtpZ2R5hlpWGh6RJYL7Xh9T6LPiU",
  authDomain: "tasca-la-fundicion.firebaseapp.com",
  projectId: "tasca-la-fundicion",
  storageBucket: "tasca-la-fundicion.appspot.com",
  messagingSenderId: "558414961450",
  appId: "1:558414961450:web:a768a3fad3247fc1d69c53",
  measurementId: "G-C6NH3K8BWQ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias de Firestore, Auth, y Storage para usarlas en toda la app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
