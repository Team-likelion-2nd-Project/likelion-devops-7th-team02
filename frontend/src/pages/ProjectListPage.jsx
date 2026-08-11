import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  ListTodo,
  Users,
} from 'lucide-react'
import ProjectCard from '../components/ProjectCard'
import ProjectCreateModal from '../components/ProjectCreateModal'
import EmptyState from '../components/EmptyState'
import ProjectContext from '../context/ProjectContext'
import './ProjectListPage.css'

function ProjectListPage() {
  const { projectList } = useContext(ProjectContext)

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const allTasks = projectList.flatMap(
    (project) => project.tasks ?? []
  )

  const totalMembers = projectList.reduce(
    (total, project) =>
      total + (project.members?.length ?? 0),
    0
  )

  const currentUserName = '이프론트'

  const myTasks = projectList.flatMap((project) =>
    (project.tasks ?? [])
      .filter((task) => task.assignee === currentUserName)
      .map((task) => ({
        ...task,
        projectId: project.id,
        projectName: project.name,
      }))
  )

  return (
    <div className="project-list-page">
      <div className="project-list-header">
        <div>
          <h1>프로젝트 대시보드</h1>
          <p>
            전체 프로젝트의 진행 현황을 한눈에 확인하세요.
          </p>
        </div>

        <button
          type="button"
          className="project-create-button"
          onClick={() => setIsCreateOpen(true)}
        >
          + 새 프로젝트
        </button>
      </div>

      <div className="dashboard-summary">
        <div className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <FolderKanban size={19} />
          </div>

          <div>
            <span>전체 프로젝트</span>
            <strong>{projectList.length}</strong>
          </div>
        </div>

        <div className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <Users size={19} />
          </div>

          <div>
            <span>전체 멤버</span>
            <strong>{totalMembers}</strong>
          </div>
        </div>

        <div className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <ListTodo size={19} />
          </div>

          <div>
            <span>전체 Task</span>
            <strong>{allTasks.length}</strong>
          </div>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2>최근 프로젝트</h2>
            <p>참여 중인 프로젝트를 확인하세요.</p>
          </div>
        </div>

        {projectList.length === 0 ? (
          <EmptyState message="프로젝트가 없습니다. 새 프로젝트를 생성해 시작해보세요." />
        ) : (
          <div className="project-grid">
            {projectList.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </section>

      <div className="dashboard-bottom-grid">
        {/* My Tasks */}
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>내 작업</h2>
              <p>내가 담당하고 있는 작업을 확인하세요.</p>
            </div>

            <span className="dashboard-my-task-count">
              {myTasks.length}개
            </span>
          </div>

          {myTasks.length === 0 ? (
            <div className="dashboard-my-task-empty">
              담당 중인 작업이 없습니다.
            </div>
          ) : (
            <div className="dashboard-my-task-list">
              {myTasks.map((task) => (
                <Link
                  key={`${task.projectId}-${task.id}`}
                  to={`/projects/${task.projectId}`}
                  className="dashboard-my-task-item"
                >
                  <div className="dashboard-my-task-content">
                    <strong>{task.title}</strong>
                    <span>{task.projectName}</span>
                  </div>

                  <span
                    className={`dashboard-task-badge ${task.status.toLowerCase()}`}
                  >
                    {task.status === 'TODO' && 'To Do'}
                    {task.status === 'IN_PROGRESS' && 'In Progress'}
                    {task.status === 'DONE' && 'Done'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Updates */}
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>최근 업데이트</h2>
              <p>프로젝트별 최근 변경 내역입니다.</p>
            </div>
          </div>

          <div className="dashboard-update-list">
            {projectList.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="dashboard-update-item"
              >
                <div>
                  <div className="dashboard-update-icon">
                    <FolderKanban size={14} />
                  </div>

                  <span>{project.name}</span>
                </div>

                <span className="dashboard-update-time">
                  {project.updatedAt}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <ProjectCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  )
}

export default ProjectListPage