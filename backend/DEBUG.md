# 🔍 Guía de Debugging - Backend PlanckFi

## Problemas Comunes y Soluciones

### 1. Variables de Entorno No Cargadas

**Síntoma**: Error "Variables de entorno faltantes" o Firebase Admin no inicializa

**Solución**:
```bash
# 1. Verificar que el archivo .env existe
ls -la backend/.env

# 2. Ejecutar script de verificación
cd backend
npm run check-env

# 3. Si no existe, crear desde el ejemplo
cp env.example .env
```

**Verificar contenido del .env**:
```env
# Variables REQUERIDAS
FIREBASE_PROJECT_ID=planckfi
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@planckfi.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-clave-privada-aqui\n-----END PRIVATE KEY-----\n"

# Variables OPCIONALES
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FIREBASE_STORAGE_BUCKET=planckfi.appspot.com
```

### 2. Error de Firebase Admin SDK

**Síntoma**: "Firebase Admin no inicializado" o errores de credenciales

**Pasos de verificación**:

1. **Obtener credenciales correctas**:
   - Ve a Firebase Console > Configuración del proyecto
   - Pestaña "Cuentas de servicio"
   - Click en "Generar nueva clave privada"
   - Descarga el archivo JSON

2. **Extraer variables del JSON**:
   ```json
   {
     "type": "service_account",
     "project_id": "planckfi",
     "private_key_id": "abc123...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@planckfi.iam.gserviceaccount.com",
     "client_id": "123456789",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40planckfi.iam.gserviceaccount.com"
   }
   ```

3. **Copiar al .env**:
   ```env
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=planckfi
   FIREBASE_PRIVATE_KEY_ID=abc123...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@planckfi.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=123456789
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40planckfi.iam.gserviceaccount.com
   ```

### 3. Error de CORS

**Síntoma**: Errores de CORS en el navegador

**Solución**:
```env
# En backend/.env
FRONTEND_URL=http://localhost:3000
```

### 4. Puerto en Uso

**Síntoma**: "EADDRINUSE" error

**Solución**:
```bash
# Verificar qué proceso usa el puerto 5000
lsof -i :5000

# Matar el proceso
kill -9 <PID>

# O cambiar el puerto en .env
PORT=5001
```

### 5. Dependencias Faltantes

**Síntoma**: "Cannot find module" errors

**Solución**:
```bash
# Reinstalar dependencias
cd backend
rm -rf node_modules package-lock.json
npm install

# O desde la raíz
npm run install:all
```

## Comandos de Debugging Útiles

### Verificar configuración
```bash
cd backend
npm run check-env
```

### Ejecutar con logs detallados
```bash
cd backend
DEBUG=* npm run dev
```

### Verificar health check
```bash
curl http://localhost:5000/api/health
```

### Verificar variables de entorno
```bash
cd backend
node -e "require('dotenv').config(); console.log(process.env.FIREBASE_PROJECT_ID)"
```

## Logs del Sistema

### Logs de Inicialización
```
🔍 Verificando variables de entorno...
📁 Directorio actual: /path/to/backend/src
🌍 NODE_ENV: development
🚀 PORT: 5000
✅ Firebase Admin inicializado correctamente
📊 Proyecto: planckfi
🚀 Servidor PlanckFi ejecutándose en puerto 5000
```

### Logs de Error Comunes
```
❌ Variables de entorno faltantes: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL
💡 Asegúrate de crear el archivo .env en la carpeta backend/
📄 Usa env.example como plantilla
```

```
❌ Error al inicializar Firebase Admin: Invalid private key
🔍 Verifica que las credenciales del Service Account sean correctas
```

## Contacto

Si los problemas persisten, revisa:
1. La configuración de Firebase Console
2. Las reglas de Firestore
3. La configuración de Authentication
4. Los logs del servidor para errores específicos 