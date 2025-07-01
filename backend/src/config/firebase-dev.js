// Configuración de Firebase para desarrollo (simulación completa)
import { getFirestore } from 'firebase-admin/firestore';

// Simular Firestore con datos en memoria
class MockFirestore {
  constructor() {
    this.collections = {
      transactions: [],
      categories: [],
      users: []
    };
  }

  collection(name) {
    return new MockCollection(this.collections[name] || []);
  }
}

class MockCollection {
  constructor(data) {
    this.data = data;
  }

  where(field, operator, value) {
    return new MockQuery(this.data.filter(item => item[field] === value));
  }

  orderBy(field, direction = 'asc') {
    const sorted = [...this.data].sort((a, b) => {
      if (direction === 'desc') {
        return b[field] > a[field] ? 1 : -1;
      }
      return a[field] > b[field] ? 1 : -1;
    });
    return new MockQuery(sorted);
  }

  limit(count) {
    return new MockQuery(this.data.slice(0, count));
  }

  offset(count) {
    return new MockQuery(this.data.slice(count));
  }

  async get() {
    return new MockQuerySnapshot(this.data);
  }

  async add(data) {
    const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newDoc = { id, ...data };
    this.data.push(newDoc);
    return { id };
  }

  doc(id) {
    return new MockDocument(this.data, id);
  }
}

class MockQuery extends MockCollection {
  constructor(data) {
    super(data);
  }
}

class MockQuerySnapshot {
  constructor(data) {
    this.data = data;
  }

  forEach(callback) {
    this.data.forEach(callback);
  }

  get size() {
    return this.data.length;
  }
}

class MockDocument {
  constructor(data, id) {
    this.data = data;
    this.id = id;
  }

  async get() {
    const doc = this.data.find(item => item.id === this.id);
    return {
      exists: !!doc,
      data: () => doc,
      id: this.id
    };
  }

  async update(data) {
    const index = this.data.findIndex(item => item.id === this.id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
    }
  }

  async delete() {
    const index = this.data.findIndex(item => item.id === this.id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }
}

// Crear instancia mock de Firestore
const mockDb = new MockFirestore();

// Agregar algunos datos de prueba
mockDb.collections.categories = [
  {
    id: 'cat-1',
    userId: 'dev-user-123',
    name: 'Comida',
    type: 'expense',
    color: '#ef4444',
    icon: '🍔',
    description: 'Gastos en alimentación',
    createdAt: new Date()
  },
  {
    id: 'cat-2',
    userId: 'dev-user-123',
    name: 'Transporte',
    type: 'expense',
    color: '#3b82f6',
    icon: '🚗',
    description: 'Gastos en transporte',
    createdAt: new Date()
  },
  {
    id: 'cat-3',
    userId: 'dev-user-123',
    name: 'Salario',
    type: 'income',
    color: '#10b981',
    icon: '💰',
    description: 'Ingresos por trabajo',
    createdAt: new Date()
  }
];

mockDb.collections.transactions = [
  {
    id: 'trans-1',
    userId: 'dev-user-123',
    type: 'expense',
    amount: 45.50,
    currency: 'USD',
    category: 'cat-1',
    description: 'Supermercado',
    date: new Date(),
    tags: ['comida', 'supermercado'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'trans-2',
    userId: 'dev-user-123',
    type: 'income',
    amount: 2500,
    currency: 'USD',
    category: 'cat-3',
    description: 'Pago mensual',
    date: new Date(),
    tags: ['salario'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Middleware de autenticación mock
export const authenticateToken = (req, res, next) => {
  try {
    // En desarrollo, simular un usuario autenticado
    const mockUser = {
      uid: 'dev-user-123',
      email: 'dev@planckfi.com',
      name: 'Usuario de Desarrollo',
    };
    
    req.user = mockUser;
    next();
  } catch (error) {
    console.warn('Error en autenticación mock:', error);
    res.status(401).json({
      error: 'Token inválido',
      message: 'Token de autenticación requerido'
    });
  }
};

export { mockDb as db }; 