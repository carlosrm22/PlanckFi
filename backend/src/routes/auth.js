import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { email, password, name } = req.body;

    // Crear usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false
    });

    // Crear documento de usuario en Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      name: name,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      profile: {
        avatar: null,
        phone: null,
        currency: 'USD',
        timezone: 'America/Mexico_City'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: name
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({
        error: 'Email ya registrado',
        message: 'Ya existe una cuenta con este email'
      });
    }

    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo registrar el usuario'
    });
  }
});

/**
 * POST /api/auth/login
 * Inicia sesión de un usuario
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Obtener usuario por email
    const userRecord = await auth.getUserByEmail(email);

    // Verificar que el usuario esté activo en Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists || !userDoc.data().isActive) {
      return res.status(401).json({
        error: 'Usuario inactivo',
        message: 'Tu cuenta ha sido desactivada'
      });
    }

    // Crear token personalizado (Firebase maneja la autenticación)
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
        picture: userRecord.photoURL
      },
      token: customToken
    });

  } catch (error) {
    console.error('Error en login:', error);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo iniciar sesión'
    });
  }
});

/**
 * GET /api/auth/me
 * Obtiene información del usuario autenticado
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe en la base de datos'
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      user: {
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt,
        profile: userData.profile
      }
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo obtener la información del usuario'
    });
  }
});

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Firebase maneja la revocación de tokens automáticamente
    // Aquí podríamos agregar lógica adicional si es necesario
    
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo cerrar la sesión'
    });
  }
});

export default router; 