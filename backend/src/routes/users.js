import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/profile
 * Obtiene el perfil completo del usuario
 */
router.get('/profile', authenticateToken, async (req, res) => {
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
      profile: {
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        isActive: userData.isActive,
        profile: userData.profile
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo obtener el perfil del usuario'
    });
  }
});

/**
 * PUT /api/users/profile
 * Actualiza el perfil del usuario
 */
router.put('/profile', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }),
  body('profile.phone').optional().isMobilePhone(),
  body('profile.currency').optional().isIn(['USD', 'EUR', 'MXN', 'COP']),
  body('profile.timezone').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { name, profile } = req.body;
    const updateData = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (profile) {
      updateData.profile = {
        ...req.user.profile,
        ...profile
      };
    }

    await db.collection('users').doc(req.user.uid).update(updateData);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      profile: updateData
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo actualizar el perfil'
    });
  }
});

/**
 * POST /api/users/avatar
 * Sube un avatar para el usuario
 */
router.post('/avatar', authenticateToken, async (req, res) => {
  try {
    // Por ahora solo actualizamos la referencia
    // En la siguiente fase implementaremos la subida de archivos
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({
        error: 'URL requerida',
        message: 'Debes proporcionar una URL para el avatar'
      });
    }

    await db.collection('users').doc(req.user.uid).update({
      'profile.avatar': avatarUrl,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Avatar actualizado exitosamente',
      avatar: avatarUrl
    });

  } catch (error) {
    console.error('Error al actualizar avatar:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo actualizar el avatar'
    });
  }
});

/**
 * DELETE /api/users/account
 * Desactiva la cuenta del usuario
 */
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    // Desactivar usuario en lugar de eliminarlo
    await db.collection('users').doc(req.user.uid).update({
      isActive: false,
      updatedAt: new Date(),
      deactivatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Cuenta desactivada exitosamente'
    });

  } catch (error) {
    console.error('Error al desactivar cuenta:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo desactivar la cuenta'
    });
  }
});

/**
 * GET /api/users/stats
 * Obtiene estadísticas básicas del usuario
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Obtener estadísticas básicas (se expandirá en fases futuras)
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();

    // Por ahora retornamos información básica
    // En fases futuras agregaremos estadísticas de transacciones
    const stats = {
      accountAge: Math.floor((new Date() - userData.createdAt.toDate()) / (1000 * 60 * 60 * 24)), // días
      isActive: userData.isActive,
      lastUpdate: userData.updatedAt,
      profile: {
        hasAvatar: !!userData.profile?.avatar,
        hasPhone: !!userData.profile?.phone,
        currency: userData.profile?.currency || 'USD'
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudieron obtener las estadísticas'
    });
  }
});

export default router; 