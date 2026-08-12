import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'

import HealthPage from '../pages/HealthPage'
import LoginPage from '../pages/LoginPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import ProjectListPage from '../pages/ProjectListPage'
import SignupPage from '../pages/SignupPage'

function RootRedirect() {
  const accessToken = localStorage.getItem('accessToken')

  return (
    <Navigate
      to={accessToken ? '/projects' : '/login'}
      replace
    />
  )
}

function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<RootRedirect />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/projects"
            element={<ProjectListPage />}
          />

          <Route
            path="/projects/:projectId"
            element={<ProjectDetailPage />}
          />

          <Route
            path="/health"
            element={<HealthPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter