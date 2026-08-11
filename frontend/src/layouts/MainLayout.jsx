import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ProjectProvider from '../context/ProjectProvider'
import './MainLayout.css'

function MainLayout() {
  return (
    <ProjectProvider>
      <div className="main-layout">
        <Header />

        <div className="main-layout-body">
          <Sidebar />

          <main className="main-layout-content">
            <Outlet />
          </main>
        </div>
      </div>
    </ProjectProvider>
  )
}

export default MainLayout