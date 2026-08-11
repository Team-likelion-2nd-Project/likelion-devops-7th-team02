import { useContext, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  FolderKanban,
  HardDrive,
  Plus,
  Users,
} from 'lucide-react'
import ProjectContext from '../context/ProjectContext'
import ProjectCreateModal from './ProjectCreateModal'
import './Sidebar.css'

function Sidebar() {
  const location = useLocation()
  const { projectList } = useContext(ProjectContext)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const projectId = Number(
    location.pathname.split('/projects/')[1]
  )

  const currentProject = projectList.find(
    (project) => project.id === projectId
  )

  return (
    <aside className="main-sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span>프로젝트</span>

          <button
            type="button"
            className="sidebar-add-button"
            aria-label="프로젝트 추가"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={16} />
          </button>
        </div>

        <nav className="sidebar-project-list">
          {projectList.map((project) => (
            <NavLink
              key={project.id}
              to={`/projects/${project.id}`}
              className={({ isActive }) =>
                `sidebar-project-item ${
                  isActive ? 'active' : ''
                }`
              }
            >
              <FolderKanban size={17} />
              <span>{project.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-team-card">
          <div className="sidebar-team-header">
            <div className="sidebar-team-icon">
              <Users size={17} />
            </div>

            <div>
              <strong>
                {currentProject?.name ?? 'DevFlow Team'}
              </strong>

              <span>
                {currentProject
                  ? `${currentProject.members?.length ?? 0} members`
                  : '프로젝트를 선택하세요'}
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar-storage">
          <div className="sidebar-storage-header">
            <div>
              <HardDrive size={15} />
              <span>저장소 사용량</span>
            </div>

            <span>72%</span>
          </div>

          <div className="sidebar-storage-track">
            <div className="sidebar-storage-progress" />
          </div>

          <div className="sidebar-storage-info">
            <span>7.2 GB</span>
            <span>10 GB</span>
          </div>
        </div>
      </div>

      <ProjectCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </aside>
  )
}

export default Sidebar