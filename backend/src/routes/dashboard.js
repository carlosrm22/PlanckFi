import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db, realtimeDb } from '../config/firebase.js';

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Obtiene estadísticas del dashboard para el usuario autenticado
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // En modo desarrollo sin Firebase real, devolver datos mock
    if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_PROJECT_ID) {
      const mockStats = {
        totalIncome: 5000,
        totalExpenses: 3200,
        balance: 1800,
        monthlyStats: [
          { month: 'Ene', income: 4500, expenses: 2800, balance: 1700 },
          { month: 'Feb', income: 5200, expenses: 3100, balance: 2100 },
          { month: 'Mar', income: 4800, expenses: 2900, balance: 1900 },
          { month: 'Abr', income: 5000, expenses: 3200, balance: 1800 },
        ],
        categoryBreakdown: [
          { categoryId: '1', categoryName: 'Comida', amount: 800, percentage: 25, color: '#ef4444' },
          { categoryId: '2', categoryName: 'Transporte', amount: 600, percentage: 19, color: '#3b82f6' },
          { categoryId: '3', categoryName: 'Entretenimiento', amount: 400, percentage: 12, color: '#8b5cf6' },
          { categoryId: '4', categoryName: 'Servicios', amount: 300, percentage: 9, color: '#10b981' },
          { categoryId: '5', categoryName: 'Otros', amount: 1100, percentage: 35, color: '#f59e0b' },
        ],
        recentTransactions: [
          {
            id: '1',
            userId: userId,
            type: 'expense',
            amount: 45.50,
            currency: 'USD',
            category: 'Comida',
            description: 'Supermercado',
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            userId: userId,
            type: 'income',
            amount: 2500,
            currency: 'USD',
            category: 'Salario',
            description: 'Pago mensual',
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      return res.json({
        success: true,
        data: mockStats,
      });
    }

    // Usar Firebase Realtime Database
    const userRef = realtimeDb.ref(`users/${userId}`);
    
    // Obtener transacciones del usuario
    const transactionsSnapshot = await userRef.child('transactions').get();
    const transactions = transactionsSnapshot.val() || {};
    
    // Obtener categorías del usuario
    const categoriesSnapshot = await userRef.child('categories').get();
    const categories = categoriesSnapshot.val() || {};

    // Calcular estadísticas
    const transactionList = Object.values(transactions);
    const categoryList = Object.values(categories);

    const totalIncome = transactionList
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpenses = transactionList
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const balance = totalIncome - totalExpenses;

    // Calcular desglose por categorías
    const categoryBreakdown = categoryList
      .filter(cat => cat.type === 'expense')
      .map(cat => {
        const categoryTransactions = transactionList.filter(t => t.categoryId === cat.id && t.type === 'expense');
        const amount = categoryTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          amount,
          percentage: Math.round(percentage),
          color: cat.color || '#6b7280'
        };
      })
      .filter(cat => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    // Transacciones recientes (últimas 5)
    const recentTransactions = transactionList
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(t => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }));

    // Estadísticas mensuales (últimos 4 meses)
    const monthlyStats = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toISOString().slice(0, 7); // YYYY-MM
      
      const monthTransactions = transactionList.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.toISOString().slice(0, 7) === monthKey;
      });

      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      monthlyStats.push({
        month: month.toLocaleDateString('es-ES', { month: 'short' }),
        income: monthIncome,
        expenses: monthExpenses,
        balance: monthIncome - monthExpenses
      });
    }

    const stats = {
      totalIncome,
      totalExpenses,
      balance,
      monthlyStats,
      categoryBreakdown,
      recentTransactions
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

export default router; 