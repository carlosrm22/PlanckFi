import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../config/firebase.js';

const router = express.Router();

/**
 * GET /api/transactions
 * Obtiene transacciones del usuario con filtros opcionales
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const {
      page = 1,
      limit = 20,
      type,
      category,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount,
      tags,
    } = req.query;

    let query = db.collection('transactions').where('userId', '==', userId);

    // Aplicar filtros
    if (type) {
      query = query.where('type', '==', type);
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    if (minAmount) {
      query = query.where('amount', '>=', parseFloat(minAmount));
    }

    if (maxAmount) {
      query = query.where('amount', '<=', parseFloat(maxAmount));
    }

    // Ordenar por fecha descendente
    query = query.orderBy('date', 'desc');

    // Paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(offset);

    const snapshot = await query.get();
    
    const transactions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });

    // Aplicar filtros adicionales en memoria
    let filteredTransactions = transactions;

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredTransactions = filteredTransactions.filter(t => t.date >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredTransactions = filteredTransactions.filter(t => t.date <= toDate);
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filteredTransactions = filteredTransactions.filter(t => 
        t.tags && tagArray.some(tag => t.tags.includes(tag))
      );
    }

    // Obtener total para paginación
    const totalSnapshot = await db
      .collection('transactions')
      .where('userId', '==', userId)
      .get();

    const total = totalSnapshot.size;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: filteredTransactions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
    });

  } catch (error) {
    console.error('❌ Error al obtener transacciones:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudieron obtener las transacciones'
    });
  }
});

/**
 * GET /api/transactions/:id
 * Obtiene una transacción específica
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('transactions').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        error: 'Transacción no encontrada',
        message: 'La transacción especificada no existe'
      });
    }

    const data = doc.data();
    
    // Verificar que la transacción pertenece al usuario
    if (data.userId !== userId) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para acceder a esta transacción'
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      },
    });

  } catch (error) {
    console.error('❌ Error al obtener transacción:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo obtener la transacción'
    });
  }
});

/**
 * POST /api/transactions
 * Crea una nueva transacción
 */
router.post('/', [
  body('type').isIn(['income', 'expense']).withMessage('Tipo debe ser income o expense'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Monto debe ser mayor a 0'),
  body('category').notEmpty().withMessage('Categoría es requerida'),
  body('description').trim().isLength({ min: 1 }).withMessage('Descripción es requerida'),
  body('date').isISO8601().withMessage('Fecha debe ser válida'),
  body('tags').optional().isArray().withMessage('Tags debe ser un array'),
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
      type,
      amount,
      category,
      description,
      date,
      tags = [],
    } = req.body;

    // Verificar que la categoría existe y pertenece al usuario
    const categoryDoc = await db.collection('categories').doc(category).get();
    if (!categoryDoc.exists) {
      return res.status(400).json({
        error: 'Categoría inválida',
        message: 'La categoría especificada no existe'
      });
    }

    const categoryData = categoryDoc.data();
    if (categoryData.userId !== userId) {
      return res.status(400).json({
        error: 'Categoría inválida',
        message: 'La categoría no pertenece al usuario'
      });
    }

    // Crear la transacción
    const transactionData = {
      userId,
      type,
      amount: parseFloat(amount),
      currency: 'USD', // TODO: Obtener de perfil del usuario
      category,
      description: description.trim(),
      date: new Date(date),
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('transactions').add(transactionData);
    const newDoc = await docRef.get();

    res.status(201).json({
      success: true,
      message: 'Transacción creada exitosamente',
      data: {
        id: docRef.id,
        ...newDoc.data(),
        date: newDoc.data().date.toDate(),
        createdAt: newDoc.data().createdAt.toDate(),
        updatedAt: newDoc.data().updatedAt.toDate(),
      },
    });

  } catch (error) {
    console.error('❌ Error al crear transacción:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo crear la transacción'
    });
  }
});

/**
 * PUT /api/transactions/:id
 * Actualiza una transacción existente
 */
router.put('/:id', [
  body('type').optional().isIn(['income', 'expense']).withMessage('Tipo debe ser income o expense'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Monto debe ser mayor a 0'),
  body('category').optional().notEmpty().withMessage('Categoría no puede estar vacía'),
  body('description').optional().trim().isLength({ min: 1 }).withMessage('Descripción no puede estar vacía'),
  body('date').optional().isISO8601().withMessage('Fecha debe ser válida'),
  body('tags').optional().isArray().withMessage('Tags debe ser un array'),
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

    // Verificar que la transacción existe y pertenece al usuario
    const doc = await db.collection('transactions').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Transacción no encontrada',
        message: 'La transacción especificada no existe'
      });
    }

    const transactionData = doc.data();
    if (transactionData.userId !== userId) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para modificar esta transacción'
      });
    }

    // Verificar categoría si se está actualizando
    if (updateData.category) {
      const categoryDoc = await db.collection('categories').doc(updateData.category).get();
      if (!categoryDoc.exists) {
        return res.status(400).json({
          error: 'Categoría inválida',
          message: 'La categoría especificada no existe'
        });
      }

      const categoryData = categoryDoc.data();
      if (categoryData.userId !== userId) {
        return res.status(400).json({
          error: 'Categoría inválida',
          message: 'La categoría no pertenece al usuario'
        });
      }
    }

    // Preparar datos de actualización
    const updateFields = {
      updatedAt: new Date(),
    };

    if (updateData.type) updateFields.type = updateData.type;
    if (updateData.amount) updateFields.amount = parseFloat(updateData.amount);
    if (updateData.category) updateFields.category = updateData.category;
    if (updateData.description) updateFields.description = updateData.description.trim();
    if (updateData.date) updateFields.date = new Date(updateData.date);
    if (updateData.tags) updateFields.tags = Array.isArray(updateData.tags) ? updateData.tags : [];

    // Actualizar la transacción
    await db.collection('transactions').doc(id).update(updateFields);

    // Obtener la transacción actualizada
    const updatedDoc = await db.collection('transactions').doc(id).get();

    res.json({
      success: true,
      message: 'Transacción actualizada exitosamente',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        date: updatedDoc.data().date.toDate(),
        createdAt: updatedDoc.data().createdAt.toDate(),
        updatedAt: updatedDoc.data().updatedAt.toDate(),
      },
    });

  } catch (error) {
    console.error('❌ Error al actualizar transacción:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo actualizar la transacción'
    });
  }
});

/**
 * DELETE /api/transactions/:id
 * Elimina una transacción
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // Verificar que la transacción existe y pertenece al usuario
    const doc = await db.collection('transactions').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Transacción no encontrada',
        message: 'La transacción especificada no existe'
      });
    }

    const transactionData = doc.data();
    if (transactionData.userId !== userId) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para eliminar esta transacción'
      });
    }

    // Eliminar la transacción
    await db.collection('transactions').doc(id).delete();

    res.json({
      success: true,
      message: 'Transacción eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al eliminar transacción:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudo eliminar la transacción'
    });
  }
});

export default router; 