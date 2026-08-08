import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'

import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import ProjectListPage from '../pages/ProjectListPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import HealthPage from '../pages/HealthPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<MainLayout />}>
          <Route path="/projects" element={<ProjectListPage />} />
          <Route
            path="/projects/:projectId"
            element={<ProjectDetailPage />}
          />
          <Route path="/health" element={<HealthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter