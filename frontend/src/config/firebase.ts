import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase para PlanckFi
const firebaseConfig = {
  apiKey: "AIzaSyAhK2kvu6fjZ3i3W4UVHbn1Y6WVWFbHQC8",
  authDomain: "planckfi.firebaseapp.com",
  databaseURL: "https://planckfi-default-rtdb.firebaseio.com",
  projectId: "planckfi",
  storageBucket: "planckfi.firebasestorage.app",
  messagingSenderId: "1056861002205",
  appId: "1:1056861002205:web:734eafe093bc4c26b23e34"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 