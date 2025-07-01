# 🚀 PlanckFi

Una plataforma financiera innovadora construida con las mejores tecnologías modernas del desarrollo web.

## ✨ Características

- **⚡ Rendimiento Ultra Rápido**: Construido con Vite para un desarrollo y build extremadamente rápido
- **🎨 Diseño Moderno**: Interfaz elegante con Tailwind CSS y soporte para modo oscuro
- **🛡️ Tipo Seguro**: TypeScript para un código más robusto y mantenible
- **📱 Responsive**: Diseño completamente adaptativo para todos los dispositivos
- **🔄 Hot Module Replacement**: Recarga automática durante el desarrollo
- **📦 Optimizado**: Build optimizado para producción
- **🔥 Backend Robusto**: API REST con Express.js y Firebase
- **🔐 Autenticación Segura**: Firebase Authentication integrado
- **🗄️ Base de Datos**: Firestore para datos en tiempo real

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **Vite** - Herramienta de build moderna y rápida
- **Firebase** - SDK para autenticación y base de datos

### Backend
- **Node.js + Express** - API REST
- **Firebase Admin SDK** - Servicios de backend de Firebase
- **Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Authentication** - Sistema de autenticación
- **Firebase Storage** - Almacenamiento de archivos

### Herramientas de Desarrollo
- **ESLint** - Linter para mantener calidad de código
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Añade prefijos CSS automáticamente
- **Concurrently** - Ejecutar frontend y backend simultáneamente

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/carlosrm22/PlanckFi.git

# Entrar al directorio
cd PlanckFi

# Instalar todas las dependencias (frontend, backend y root)
npm run install:all

# Configurar variables de entorno
cp backend/env.example backend/.env
# Editar backend/.env con tus credenciales de Firebase
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo (frontend + backend)
npm run dev

# Solo frontend
npm run dev:frontend

# Solo backend
npm run dev:backend

# Build para producción
npm run build

# Preview del build
npm run start

# Linting del código
npm run lint
```

## 📁 Estructura del Proyecto

```
PlanckFi/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── hooks/         # Custom hooks de React
│   │   ├── utils/         # Funciones utilitarias
│   │   ├── types/         # Definiciones de tipos TypeScript
│   │   ├── assets/        # Recursos estáticos
│   │   ├── App.tsx        # Componente principal
│   │   ├── main.tsx       # Punto de entrada
│   │   └── index.css      # Estilos globales
│   ├── public/            # Archivos públicos
│   ├── index.html         # HTML principal
│   ├── vite.config.ts     # Configuración de Vite
│   ├── tailwind.config.js # Configuración de Tailwind
│   ├── tsconfig.json      # Configuración de TypeScript
│   └── package.json       # Dependencias del frontend
├── backend/               # API REST con Express
│   ├── src/
│   │   ├── config/        # Configuraciones (Firebase, etc.)
│   │   ├── controllers/   # Controladores de la API
│   │   ├── middleware/    # Middleware personalizado
│   │   ├── routes/        # Rutas de la API
│   │   ├── utils/         # Utilidades del backend
│   │   └── server.js      # Servidor principal
│   ├── .env               # Variables de entorno
│   └── package.json       # Dependencias del backend
├── shared/                # Código compartido
│   ├── types/             # Tipos compartidos
│   └── utils/             # Utilidades compartidas
├── package.json           # Configuración del workspace
└── README.md              # Este archivo
```

## 🔧 Configuración de Firebase

### 1. Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication, Firestore y Storage

### 2. Configurar Autenticación
1. En Firebase Console, ve a Authentication
2. Habilita Email/Password
3. Configura las reglas de seguridad

### 3. Configurar Firestore
1. Ve a Firestore Database
2. Crea la base de datos en modo de prueba
3. Configura las reglas de seguridad

### 4. Obtener Credenciales
1. Ve a Project Settings > Service Accounts
2. Genera una nueva clave privada
3. Copia las credenciales al archivo `backend/.env`

### 5. Variables de Entorno
```env
# Firebase Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu private key aquí\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=tu-project-id.appspot.com
```

## 🎨 Personalización

### Colores
El proyecto incluye una paleta de colores personalizada en `frontend/tailwind.config.js`:

- **Primary**: Azules para elementos principales
- **Secondary**: Grises para elementos secundarios

### Componentes
Los componentes están organizados en:
- **Componentes Base**: Botones, tarjetas, etc.
- **Componentes de Página**: Componentes específicos de cada vista
- **Layouts**: Estructuras de página reutilizables

## 🔧 Configuración

### TypeScript
Configurado con opciones estrictas para máxima seguridad de tipos.

### ESLint
Reglas configuradas para mantener la calidad del código:
- No usar `console.log` (usar `console.warn` o `console.error`)
- Preferir `const` sobre `let`
- Variables no utilizadas marcadas con `_`

### Tailwind CSS
Configurado con:
- Colores personalizados
- Fuentes personalizadas
- Componentes utilitarios

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **GitHub**: [@carlosrm22](https://github.com/carlosrm22)
- **Proyecto**: [PlanckFi](https://github.com/carlosrm22/PlanckFi)

---

Desarrollado con ❤️ usando las mejores tecnologías modernas. 