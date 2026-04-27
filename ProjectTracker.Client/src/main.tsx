import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext.tsx'
import { ProjectProvider } from './context/ProjectContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ProjectProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ProjectProvider>
    </AuthProvider>
  </StrictMode>,
)
