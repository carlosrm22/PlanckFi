import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../config/firebase.js';

const router = express.Router();

/**
 * GET /api/categories
 * Obtiene todas las categorías del usuario
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection('categories')
      .where('userId', '==', userId)
      .orderBy('name')
      .get();

    const categories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      });
    });

    res.json({
      success: true,
      data: categories,
    });

  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudieron obtener las categorías'
    });
  }
});

/**
 * GET /api/categories/:id
 * Obtiene una categoría específica
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('categories').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: 'La categoría especificada no existe'
      });
    }

    const data = doc.data();
    
    // Verificar que la categoría pertenece al usuario
    if (data.userId !== userId) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para acceder a esta categoría'
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      },
    });

  } catch (error) {
    console.error('❌ Error al obtener categoría:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo obtener la categoría'
    });
  }
});

/**
 * POST /api/categories
 * Crea una nueva categoría
 */
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Nombre debe tener entre 1 y 50 caracteres'),
  body('type').isIn(['income', 'expense']).withMessage('Tipo debe ser income o expense'),
  body('color').isHexColor().withMessage('Color debe ser un código hexadecimal válido'),
  body('icon').optional().isString().withMessage('Icono debe ser una cadena de texto'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Descripción no puede exceder 200 caracteres'),
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const userId = req.user.uid;
    const {
      name,
      type,
      color,
      icon = '📁',
      description = '',
    } = req.body;

    // Verificar que no existe una categoría con el mismo nombre para el usuario
    const existingSnapshot = await db
      .collection('categories')
      .where('userId', '==', userId)
      .where('name', '==', name.trim())
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({
        error: 'Categoría duplicada',
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    // Crear la categoría
    const categoryData = {
      userId,
      name: name.trim(),
      type,
      color,
      icon,
      description: description.trim(),
      createdAt: new Date(),
    };

    const docRef = await db.collection('categories').add(categoryData);
    const newDoc = await docRef.get();

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: {
        id: docRef.id,
        ...newDoc.data(),
        createdAt: newDoc.data().createdAt.toDate(),
      },
    });

  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo crear la categoría'
    });
  }
});

/**
 * PUT /api/categories/:id
 * Actualiza una categoría existente
 */
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Nombre debe tener entre 1 y 50 caracteres'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Tipo debe ser income o expense'),
  body('color').optional().isHexColor().withMessage('Color debe ser un código hexadecimal válido'),
  body('icon').optional().isString().withMessage('Icono debe ser una cadena de texto'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Descripción no puede exceder 200 caracteres'),
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.uid;
    const updateData = req.body;

    // Verificar que la categoría existe y pertenece al usuario
    const doc = await db.collection('categories').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: 'La categoría especificada no existe'
      });
    }

    const categoryData = doc.data();
    if (categoryData.userId !== userId) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para modificar esta categoría'
      });
    }

    // Verificar que no existe otra categoría con el mismo nombre si se está actualizando
    if (updateData.name) {
      const existingSnapshot = await db
        .collection('categories')
        .where('userId', '==', userId)
        .where('name', '==', updateData.name.trim())
        .get();

      const existingCategory = existingSnapshot.docs.find(doc => doc.id !== id);
      if (existingCategory) {
        return res.status(400).json({
          error: 'Categoría duplicada',
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    // Preparar datos de actualización
    const updateFields = {};

    if (updateData.name) updateFields.name = updateData.name.trim();
    if (updateData.type) updateFields.type = updateData.type;
    if (updateData.color) updateFields.color = updateData.color;
    if (updateData.icon) updateFields.icon = updateData.icon;
    if (updateData.description !== undefined) updateFields.description = updateData.description.trim();

    // Actualizar la categoría
    await db.collection('categories').doc(id).update(updateFields);

    // Obtener la categoría actualizada
    const updatedDoc = await db.collection('categories').doc(id).get();

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt.toDate(),
      },
    });

  } catch (error) {
    console.error('❌ Error al actualizar categoría:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo actualizar la categoría'
    });
  }
});

/**
 * DELETE /api/categories/:id
 * Elimina una categoría
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // Verificar que la categoría existe y pertenece al usuario
    const doc = await db.collection('categories').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: 'La categoría especificada no existe'
      });
    }

    const categoryData = doc.data();
    if (categoryData.userId !== userId) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para eliminar esta categoría'
      });
    }

    // Verificar que no hay transacciones usando esta categoría
    const transactionsSnapshot = await db
      .collection('transactions')
      .where('userId', '==', userId)
      .where('category', '==', id)
      .limit(1)
      .get();

    if (!transactionsSnapshot.empty) {
      return res.status(400).json({
        error: 'Categoría en uso',
        message: 'No se puede eliminar una categoría que tiene transacciones asociadas'
      });
    }

    // Eliminar la categoría
    await db.collection('categories').doc(id).delete();

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo eliminar la categoría'
    });
  }
});

export default router; 