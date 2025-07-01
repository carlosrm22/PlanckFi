# 🚀 PlanckFi - Plataforma Financiera Inteligente

Plataforma financiera moderna construida con React, TypeScript, Tailwind CSS y Firebase.

## 📋 Características

- 🔐 **Autenticación robusta** con Firebase Auth
- 📱 **Interfaz moderna** con Tailwind CSS
- 🔒 **Backend seguro** con Express y Firebase Admin
- 📊 **Dashboard financiero** (en desarrollo)
- 📸 **OCR de recibos** (próximamente)
- 💰 **Gestión de finanzas** (próximamente)

## 🛠️ Tecnologías

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Vite
- Firebase SDK

### Backend
- Node.js + Express
- Firebase Admin SDK
- JWT Authentication
- Rate Limiting
- Helmet Security

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/carlosrm22/PlanckFi.git
cd PlanckFi
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar Firebase

#### 3.1 Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado "PlanckFi"
3. Activa Authentication (Email/Password y Google)
4. Activa Firestore Database
5. Activa Storage

#### 3.2 Configurar credenciales del backend
1. Ve a Configuración del proyecto > Cuentas de servicio
2. Genera una nueva clave privada
3. Descarga el archivo JSON
4. Copia `backend/env.example` a `backend/.env`
5. Completa las variables con los datos del archivo JSON:

```env
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-clave-privada-aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
```

#### 3.3 Configurar credenciales del frontend
1. Ve a Configuración del proyecto > Configuración general
2. En "Tus apps", agrega una app web
3. Copia la configuración a `frontend/src/config/firebase.ts`

### 4. Verificar configuración
```bash
cd backend
npm run check-env
```

### 5. Ejecutar el proyecto

#### Desarrollo (ambos servicios)
```bash
npm run dev
```

#### Solo frontend
```bash
npm run dev:frontend
```

#### Solo backend
```bash
npm run dev:backend
```

## 📁 Estructura del Proyecto

```
PlanckFi/
├── frontend/                 # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── contexts/         # Contextos (Auth)
│   │   ├── hooks/           # Hooks personalizados
│   │   └── config/          # Configuración Firebase
├── backend/                  # Express + Firebase Admin
│   ├── src/
│   │   ├── routes/          # Rutas de la API
│   │   ├── middleware/      # Middlewares
│   │   ├── config/          # Configuración Firebase
│   │   └── scripts/         # Scripts de utilidad
└── shared/                   # Código compartido
```

## 🔧 Scripts Disponibles

### Raíz del proyecto
- `npm run dev` - Ejecuta frontend y backend en desarrollo
- `npm run build` - Construye ambos proyectos
- `npm run install:all` - Instala dependencias de todos los proyectos

### Backend
- `npm run dev` - Ejecuta en modo desarrollo con nodemon
- `npm run start` - Ejecuta en modo producción
- `npm run check-env` - Verifica variables de entorno

### Frontend
- `npm run dev` - Ejecuta servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔍 Troubleshooting

### Error: "Variables de entorno faltantes"
```bash
cd backend
npm run check-env
```
Asegúrate de que el archivo `.env` esté en la carpeta `backend/` y contenga todas las variables requeridas.

### Error: "Firebase Admin no inicializado"
Verifica que las credenciales del Service Account sean correctas y que el archivo `.env` esté bien formateado.

### Error: "CORS"
El backend está configurado para aceptar requests desde `http://localhost:3000`. Si usas otro puerto, actualiza `FRONTEND_URL` en el `.env`.

## 📝 Próximas Características

- [ ] Dashboard financiero completo
- [ ] Subida y análisis de recibos con OCR
- [ ] Gestión de presupuestos
- [ ] Reportes y estadísticas
- [ ] Integración con APIs bancarias
- [ ] Notificaciones push
- [ ] App móvil

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Carlos** - [GitHub](https://github.com/carlosrm22)

---

⭐ Si este proyecto te ayuda, ¡dale una estrella! 