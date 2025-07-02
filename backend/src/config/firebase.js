import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getDatabase } from 'firebase-admin/database';

// Verificar si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

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
    console.error('🔑 Obtén las credenciales desde Firebase Console > Configuración > Cuentas de servicio');
    throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
  }
};

let auth, db, storage, realtimeDb;
let isInitialized = false;

// Función para inicializar Firebase
const initializeFirebase = () => {
  if (isInitialized) return;
  
  // Validar variables antes de continuar
  validateEnvironmentVariables();

  if (isDevelopment && !process.env.FIREBASE_PROJECT_ID) {
  console.log('🔧 Modo desarrollo: Usando simulación de Firebase');
  
  // Crear simulación simple
  db = {
    collection: (name) => ({
      where: () => ({
        orderBy: () => ({
          limit: () => ({
            get: () => Promise.resolve({
              forEach: () => {},
              size: 0
            })
          })
        })
      }),
      add: () => Promise.resolve({ id: 'mock-id' }),
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      })
    })
  };
  
  auth = {
    verifyIdToken: () => Promise.resolve({ 
      uid: 'dev-user-123', 
      email: 'dev@planckfi.com',
      name: 'Usuario de Desarrollo'
    })
  };
  
  storage = {
    bucket: () => ({
      file: () => ({
        save: () => Promise.resolve()
      })
    })
  };

  realtimeDb = {
    ref: () => ({
      child: () => ({
        set: () => Promise.resolve(),
        get: () => Promise.resolve({ val: () => null }),
        update: () => Promise.resolve(),
        remove: () => Promise.resolve()
      })
    })
  };
  
  console.log('✅ Simulación de Firebase inicializada en modo desarrollo');
} else {

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
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      console.log('✅ Firebase Admin inicializado correctamente');
      console.log(`📊 Proyecto: ${process.env.FIREBASE_PROJECT_ID}`);
      console.log(`🗄️ Realtime Database: ${process.env.FIREBASE_DATABASE_URL}`);
    } catch (error) {
      console.error('❌ Error al inicializar Firebase Admin:', error.message);
      console.error('🔍 Verifica que las credenciales del Service Account sean correctas');
      throw error;
    }
  }

  // Inicializar servicios de Firebase
  auth = getAuth();
  db = getFirestore();
  storage = getStorage();
  realtimeDb = getDatabase();

  // Configuración de Firestore
  db.settings({
    ignoreUndefinedProperties: true
  });
  }
  
  isInitialized = true;
};

// Funciones getter que inicializan Firebase cuando se acceden
const getFirebaseAuth = () => {
  initializeFirebase();
  return auth;
};

const getFirebaseDb = () => {
  initializeFirebase();
  return db;
};

const getFirebaseStorage = () => {
  initializeFirebase();
  return storage;
};

const getFirebaseRealtimeDb = () => {
  initializeFirebase();
  return realtimeDb;
};

// Exportar servicios de Firebase
export { getFirebaseAuth as auth, getFirebaseDb as db, getFirebaseStorage as storage, getFirebaseRealtimeDb as realtimeDb };

export default {
  auth: getFirebaseAuth,
  db: getFirebaseDb,
  storage: getFirebaseStorage,
  realtimeDb: getFirebaseRealtimeDb
}; 