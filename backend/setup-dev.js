import fs from 'fs';
import path from 'path';

const envContent = `# Configuración del servidor
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Firebase Configuration (valores de desarrollo)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=planckfi-dev
FIREBASE_PRIVATE_KEY_ID=dev-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\\nzLmdvrtLDV6mH8Jd1K1T+FfqJq/Lqsqw1q7XjEj6v1L1pccy1dnz+1vWvu3Mlr0\\n3Qz3N2OLUq1lf+1p2y5RwTI3ucSxEfY3g==\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-dev@planckfi-dev.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=dev-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dev%40planckfi-dev.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=planckfi-dev.appspot.com

# JWT Configuration
JWT_SECRET=dev-jwt-secret-key-for-development-only
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

const envPath = path.join(process.cwd(), '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado exitosamente');
  console.log('📁 Ubicación:', envPath);
} catch (error) {
  console.error('❌ Error al crear el archivo .env:', error.message);
} 