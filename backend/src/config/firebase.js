import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Función para validar variables de entorno requeridas
const validateEnvironmentVariables = () => {
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars);
    console.error('💡 Asegúrate de crear el archivo .env en la carpeta backend/');
    console.error('📄 Usa env.example como plantilla');
    throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
  }
};

// Validar variables antes de continuar
validateEnvironmentVariables();

// Configuración de Firebase Admin
const firebaseConfig = {
  type: process.env.FIREBASE_TYPE || 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
  token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Inicializar Firebase Admin si no está ya inicializado
if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert(firebaseConfig),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    console.log('✅ Firebase Admin inicializado correctamente');
    console.log(`📊 Proyecto: ${process.env.FIREBASE_PROJECT_ID}`);
  } catch (error) {
    console.error('❌ Error al inicializar Firebase Admin:', error.message);
    console.error('🔍 Verifica que las credenciales del Service Account sean correctas');
    throw error;
  }
}

// Exportar servicios de Firebase
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

// Configuración de Firestore
db.settings({
  ignoreUndefinedProperties: true
});

export default {
  auth,
  db,
  storage
}; 