import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../config/firebase.js';

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Obtiene estadísticas del dashboard para el usuario autenticado
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // En modo desarrollo, devolver datos mock
    if (process.env.NODE_ENV === 'development') {
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
    
    // Obtener transacciones del usuario
    const transactionsSnapshot = await db
      .collection('transactions')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .limit(100)
      .get();

    const transactions = [];
    transactionsSnapshot.forEach(doc => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      });
    });

    // Calcular estadísticas básicas
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Obtener categorías del usuario
    const categoriesSnapshot = await db
      .collection('categories')
      .where('userId', '==', userId)
      .get();

    const categories = [];
    categoriesSnapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      });
    });

    // Calcular desglose por categorías (solo gastos)
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryBreakdown = [];
    const categoryTotals = {};

    expenseTransactions.forEach(transaction => {
      const categoryId = transaction.category;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += transaction.amount;
    });

    // Encontrar información de categorías
    Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        categoryBreakdown.push({
          categoryId,
          categoryName: category.name,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
          color: category.color,
        });
      }
    });

    // Ordenar por monto descendente
    categoryBreakdown.sort((a, b) => b.amount - a.amount);

    // Calcular estadísticas mensuales (últimos 6 meses)
    const monthlyStats = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthBalance = monthIncome - monthExpenses;

      monthlyStats.push({
        month: month.toLocaleDateString('es-MX', { month: 'short' }),
        income: monthIncome,
        expenses: monthExpenses,
        balance: monthBalance,
      });
    }

    // Transacciones recientes (últimas 5)
    const recentTransactions = transactions
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        userId: t.userId,
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        category: t.category,
        description: t.description,
        date: t.date,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }));

    const stats = {
      totalIncome,
      totalExpenses,
      balance,
      monthlyStats,
      categoryBreakdown,
      recentTransactions,
    };

    res.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('❌ Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: 'No se pudieron obtener las estadísticas del dashboard'
    });
  }
});

export default router; 