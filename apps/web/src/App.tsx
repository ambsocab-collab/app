import { cn } from '@shared/utils'

function App() {
  return (
    <div className={cn('min-h-screen bg-gray-50')}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GMAO Maintenance Management System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Repository setup complete! Ready for development.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
            <ul className="text-left space-y-2 text-gray-700">
              <li>✅ Monorepo structure created</li>
              <li>✅ TypeScript configuration set up</li>
              <li>✅ Environment variables configured</li>
              <li>✅ Development tools configured</li>
              <li>🔄 Install dependencies with <code className="bg-gray-100 px-2 py-1 rounded">pnpm install</code></li>
              <li>🔄 Configure Supabase</li>
              <li>🔄 Start development with <code className="bg-gray-100 px-2 py-1 rounded">pnpm dev</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App