import { useContext, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  FolderKanban,
  Plus,
  Users,
} from 'lucide-react'

import ProjectCreateModal from './ProjectCreateModal'
import ProjectContext from '../context/ProjectContext'

import './Sidebar.css'

function Sidebar() {
  const location = useLocation()
  const { 
    projectList,
    currentUser,
   } = useContext(ProjectContext)

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const projectId = Number(
    location.pathname.split('/projects/')[1]
  )

  const currentProject = projectList.find(
    (project) => project.id === projectId
  )

  const currentProjectMemberCount =
    currentProject?.members?.length ?? 0


  const currentProjectMember =
    currentProject?.members?.find(
      (member) =>
        member.userId === currentUser?.userId
    )
  
  const currentProjectRole = 
   currentProjectMember?.role ?? null

  const isProjectDetail =
    location.pathname.startsWith('/projects/') &&
    Boolean(currentProject)

  return (
    <aside className="main-sidebar">
      {/* Project List */}
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

      {/* Project Detail Info */}
      {isProjectDetail && (
        <div className="sidebar-bottom">
          <div className="sidebar-team-card">
            <div className="sidebar-team-header">
              <div className="sidebar-team-icon">
                <Users size={17} />
              </div>

              <div className="sidebar-team-info">
                <strong>
                  {currentProject.name}
                </strong>

                <span>
                  {currentProjectMemberCount}{' '}
                  {currentProjectMemberCount === 1
                    ? 'member'
                    : 'members'}
                </span>

                {currentProjectRole && (
                  <div className="sidebar-role">
                    <strong>
                      {currentProjectRole}
                    </strong>

                    <span>
                      {currentProjectRole === 'OWNER'
                        ? '프로젝트 관리자'
                        : '프로젝트 멤버'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ProjectCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </aside>
  )
}

export default Sidebar