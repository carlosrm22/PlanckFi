#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🔍 Verificación de Variables de Entorno - PlanckFi Backend\n');

// Variables requeridas
const requiredVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

// Variables opcionales
const optionalVars = [
  'PORT',
  'NODE_ENV',
  'FRONTEND_URL',
  'FIREBASE_STORAGE_BUCKET',
  'JWT_SECRET'
];

console.log('📋 Variables Requeridas:');
let allRequiredPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('PRIVATE_KEY') ? '***CONFIGURADO***' : value}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADO`);
    allRequiredPresent = false;
  }
});

console.log('\n📋 Variables Opcionales:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️ ${varName}: No configurado (usando valor por defecto)`);
  }
});

console.log('\n📁 Información del Sistema:');
console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`🚀 PORT: ${process.env.PORT || '5000'}`);
console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);

if (allRequiredPresent) {
  console.log('\n🎉 ¡Todas las variables requeridas están configuradas!');
  console.log('💡 Puedes ejecutar: npm run dev');
} else {
  console.log('\n❌ Faltan variables requeridas');
  console.log('💡 Crea el archivo .env en la carpeta backend/ usando env.example como plantilla');
  console.log('📄 Ejemplo: cp env.example .env');
  process.exit(1);
} 