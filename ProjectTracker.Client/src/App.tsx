import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import Root from './Root.tsx'
import ErrorPage from './pages/ErrorPage.tsx'
import Navbar from './components/shared/Navbar.tsx'
import Sidebar from './components/shared/Sidebar.tsx'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProjectHubPage from './pages/Projecthub'
import GeneralDashboard from './pages/DashboardGroup/GeneralDashboard.tsx'
import RequirementsDashboard from './pages/DashboardGroup/RequirementsDashboard.tsx'
import EffortLogDashboard from './pages/DashboardGroup/EffortLogDashboard.tsx'
import EffortSummaryDashboard from './pages/DashboardGroup/EffortSummaryDashboard.tsx'
import { useAuth } from './context/AuthContext'
import { Toaster } from './components/ui/sonner.tsx'



const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  // const devMode: boolean = true;
  return (
    
    isAuthenticated() ? 
    <>
      <Navbar />
      <Outlet />
    </> : <Navigate to="/" />
  )
}

const DashboardGroup = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, 
        element: <Navigate to="/login" replace /> 
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/sign-up",
        element: <SignUpPage />
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/project-hub",
            element: <ProjectHubPage />
          },
          {
            element: <DashboardGroup />,
            children: [
            {
              path: ":project-name/general/:id",
              element: <GeneralDashboard />,
            },
            {
              path: ":project-name/requirements/:id",
              element: <RequirementsDashboard />
            },
            {
              path: ":project-name/effort-log/:id",
              element: <EffortLogDashboard />,
            },
            {
              path: ":project-name/effort-summary/:id",
              element: <EffortSummaryDashboard />
            }
            ]
          }
        ]
      }
    ]
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router}/>
      <Toaster richColors/>
    </>
  )
}

export default App
