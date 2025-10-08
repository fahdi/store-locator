import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            BlueSky Store Locator
          </h1>
          <p className="text-gray-600 mb-6">
            Modern store management for Doha, Qatar
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Count is {count}
            </button>
            
            <div className="text-sm text-gray-500">
              <p>✅ React + TypeScript</p>
              <p>✅ Vite + Tailwind CSS</p>
              <p>✅ Modern Development Setup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App