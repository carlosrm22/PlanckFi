import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            🚀 PlanckFi
          </h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-300">
            Plataforma Financiera Innovadora
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tarjeta de Bienvenida */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">
                ¡Bienvenido a PlanckFi!
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Tu plataforma financiera del futuro. Construida con las mejores tecnologías modernas.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">React 18 + TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Tailwind CSS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Vite Build Tool</span>
                </div>
              </div>
            </div>

            {/* Tarjeta de Demostración */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4">
                Demostración Interactiva
              </h2>
              <div className="text-center">
                <button 
                  onClick={() => setCount((count) => count + 1)}
                  className="btn-primary mb-4"
                >
                  Contador: {count}
                </button>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Edita <code className="bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded">src/App.tsx</code> y guarda para probar HMR
                </p>
              </div>
            </div>
          </div>

          {/* Sección de Características */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center text-secondary-800 dark:text-secondary-200 mb-8">
              Características Principales
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Rendimiento</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Construido con Vite para un desarrollo ultra rápido
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Diseño Moderno</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Interfaz elegante con Tailwind CSS y modo oscuro
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold mb-2">Tipo Seguro</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  TypeScript para un código más robusto y mantenible
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App 