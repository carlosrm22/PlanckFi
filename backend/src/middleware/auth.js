import { auth } from '../config/firebase.js';

/**
 * Middleware para verificar el token de autenticación de Firebase
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de acceso requerido',
        message: 'Debes proporcionar un token de autenticación'
      });
    }

    // Verificar el token con Firebase
    const decodedToken = await auth.verifyIdToken(token);
    
    // Agregar información del usuario al request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture
    };

    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        error: 'Token revocado',
        message: 'Tu sesión ha sido revocada, por favor inicia sesión nuevamente'
      });
    }

    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token de autenticación no es válido'
    });
  }
};

/**
 * Middleware opcional para autenticación (no bloquea si no hay token)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      };
    }

    next();
  } catch (error) {
    // Si hay error, continuamos sin autenticación
    next();
  }
}; 