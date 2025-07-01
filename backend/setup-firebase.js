import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🔧 Configuración de Firebase para PlanckFi');
console.log('==========================================\n');

console.log('📋 Instrucciones:');
console.log('1. Ve a https://console.firebase.google.com/');
console.log('2. Selecciona tu proyecto "planckfi"');
console.log('3. Ve a Configuración del proyecto (ícono de engranaje)');
console.log('4. Ve a la pestaña "Cuentas de servicio"');
console.log('5. Haz clic en "Generar nueva clave privada"');
console.log('6. Descarga el archivo JSON\n');

const setupFirebase = async () => {
  try {
    console.log('📁 ¿Dónde guardaste el archivo JSON de credenciales?');
    const jsonPath = await question('Ruta del archivo (ej: /home/user/planckfi-firebase.json): ');
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ El archivo no existe. Verifica la ruta.');
      rl.close();
      return;
    }

    const credentials = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    const envContent = `# Configuración del servidor
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_TYPE=${credentials.type}
FIREBASE_PROJECT_ID=${credentials.project_id}
FIREBASE_PRIVATE_KEY_ID=${credentials.private_key_id}
FIREBASE_PRIVATE_KEY="${credentials.private_key.replace(/\n/g, '\\n')}"
FIREBASE_CLIENT_EMAIL=${credentials.client_email}
FIREBASE_CLIENT_ID=${credentials.client_id}
FIREBASE_AUTH_URI=${credentials.auth_uri}
FIREBASE_TOKEN_URI=${credentials.token_uri}
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=${credentials.auth_provider_x509_cert_url}
FIREBASE_CLIENT_X509_CERT_URL=${credentials.client_x509_cert_url}
FIREBASE_STORAGE_BUCKET=${credentials.project_id}.appspot.com

# Firebase Realtime Database URL
FIREBASE_DATABASE_URL=https://${credentials.project_id}-default-rtdb.firebaseio.com

# JWT Configuration
JWT_SECRET=planckfi-jwt-secret-key-${Date.now()}
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Archivo .env creado exitosamente');
    console.log('📁 Ubicación:', envPath);
    console.log('🔑 Credenciales de Firebase configuradas');
    console.log('🗄️ Realtime Database configurado');
    
    // Limpiar el archivo de credenciales por seguridad
    console.log('\n⚠️ Por seguridad, elimina el archivo de credenciales JSON');
    console.log('📄 Archivo:', jsonPath);
    
  } catch (error) {
    console.error('❌ Error al configurar Firebase:', error.message);
  } finally {
    rl.close();
  }
};

setupFirebase(); 