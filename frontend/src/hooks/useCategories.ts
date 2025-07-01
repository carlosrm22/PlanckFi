import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryFormData } from '../types';
import { apiService } from '../services/api';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryFormData) => Promise<Category>;
  updateCategory: (id: string, data: CategoryFormData) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getCategories();
      setCategories(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar categorías';
      setError(errorMessage);
      console.warn('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CategoryFormData): Promise<Category> => {
    try {
      setLoading(true);
      setError(null);
      
      const newCategory = await apiService.createCategory(data);
      
      // Agregar la nueva categoría a la lista local
      setCategories(prev => [...prev, newCategory]);
      
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear categoría';
      setError(errorMessage);
      console.warn('Error creating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: CategoryFormData): Promise<Category> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCategory = await apiService.updateCategory(id, data);
      
      // Actualizar la categoría en la lista local
      setCategories(prev => 
        prev.map(category => 
          category.id === id ? updatedCategory : category
        )
      );
      
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar categoría';
      setError(errorMessage);
      console.warn('Error updating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiService.deleteCategory(id);
      
      // Remover la categoría de la lista local
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar categoría';
      setError(errorMessage);
      console.warn('Error deleting category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar categorías iniciales
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  };
}; 