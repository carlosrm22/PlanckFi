import React, { useState } from 'react';
import { apiService } from '../services/api';
import { useAuthContext } from '../contexts/AuthContext';

export const TestIntegration: React.FC = () => {
  const { user } = useAuthContext();
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHealthCheck = async () => {
    setLoading(true);
    setStatus('Probando conexión con el backend...');
    
    try {
      const response = await apiService.healthCheck();
      setStatus(`✅ Backend conectado: ${response.message}`);
    } catch (error) {
      setStatus(`❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const testDashboardStats = async () => {
    setLoading(true);
    setStatus('Probando estadísticas del dashboard...');
    
    try {
      const stats = await apiService.getDashboardStats();
      setStatus(`✅ Estadísticas obtenidas: Ingresos $${stats.totalIncome}, Gastos $${stats.totalExpenses}`);
    } catch (error) {
      setStatus(`❌ Error al obtener estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const testCategories = async () => {
    setLoading(true);
    setStatus('Probando categorías...');
    
    try {
      const categories = await apiService.getCategories();
      setStatus(`✅ Categorías obtenidas: ${categories.length} categorías`);
    } catch (error) {
      setStatus(`❌ Error al obtener categorías: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const testTransactions = async () => {
    setLoading(true);
    setStatus('Probando transacciones...');
    
    try {
      const transactions = await apiService.getTransactions();
      setStatus(`✅ Transacciones obtenidas: ${transactions.data.length} transacciones`);
    } catch (error) {
      setStatus(`❌ Error al obtener transacciones: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Debes iniciar sesión para probar la integración</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Prueba de Integración</h2>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-800 text-sm">
          <strong>Usuario:</strong> {user.email}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={testHealthCheck}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          🔍 Probar Conexión Backend
        </button>

        <button
          onClick={testDashboardStats}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          📊 Probar Estadísticas Dashboard
        </button>

        <button
          onClick={testCategories}
          disabled={loading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          🏷️ Probar Categorías
        </button>

        <button
          onClick={testTransactions}
          disabled={loading}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          💰 Probar Transacciones
        </button>
      </div>

      {status && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-700">{status}</p>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}
    </div>
  );
}; 