import { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProjectContext from '../context/ProjectContext'
import TaskCard from '../components/TaskCard'
import TaskCreateModal from '../components/TaskCreateModal'
import MemberCreateModal from '../components/MemberCreateModal'
import './ProjectDetailPage.css'

function ProjectDetailPage() {
  const { projectId } = useParams()

  return (
    <ProjectDetailContent
      key={projectId}
      projectId={projectId}
    />
  )
}

function ProjectDetailContent({ projectId }) {
  const { projectList } = useContext(ProjectContext)

  const project = projectList.find(
    (project) => project.id === Number(projectId)
  )

  // Member
  const [memberList, setMemberList] = useState(project?.members ?? [])
  const [isMemberCreateOpen, setIsMemberCreateOpen] = useState(false)

  // Task
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false)
  const [taskList, setTaskList] = useState(project?.tasks ?? [])
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null)

  const handleCreateMember = ({
    name,
    role,
  }) => {
    const newMember = {
      id: Date.now(),
      name,
      role,
    }

    setMemberList((prevMembers) => [
      ...prevMembers,
      newMember,
    ])
  }

  const handleCreateTask = ({
    title,
    status,
    assignee,
  }) => {
    const newTask = {
      id: Date.now(),
      title,
      status,
      assignee,
    }

    setTaskList((prevTasks) => [
      ...prevTasks,
      newTask,
    ])
  }

  const handleTaskStatusChange = (taskId, status) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status }
          : task
      )
    )
  }

  const handleTaskTitleChange = (taskId, title) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, title }
          : task
      )
    )
  }

  const handleTaskAssigneeChange = (taskId, assignee) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignee: assignee || '담당자 없음',
            }
          : task
      )
    )
  }

  const handleDeleteTask = (taskId) => {
    setTaskList((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    )
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <p>프로젝트를 찾을 수 없습니다.</p>
        <Link to="/projects">
          프로젝트 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const todoTasks = taskList.filter(
    (task) => task.status === 'TODO'
  )

  const inProgressTasks = taskList.filter(
    (task) => task.status === 'IN_PROGRESS'
  )

  const doneTasks = taskList.filter(
    (task) => task.status === 'DONE'
  )

  return (
    <div className="project-detail-page">
      <Link to="/projects" className="project-back-link">
        ← 프로젝트 목록
      </Link>

      <div className="project-detail-header">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
      </div>

      <div className="project-detail-content">
        <div className="project-main-column">
          {/* Task Board */}
          <section className="project-section project-board-section">
            <div className="project-section-header">
              <div>
                <h2>작업 보드</h2>
                <p className="project-section-description">
                  프로젝트 작업 진행 상황을 확인하세요.
                </p>
              </div>

              <button
                type="button"
                className="task-create-button"
                onClick={() => setIsTaskCreateOpen(true)}
              >
                + 작업 추가
              </button>
            </div>

            <TaskCreateModal
              isOpen={isTaskCreateOpen}
              members={memberList}
              onCreate={handleCreateTask}
              onClose={() => setIsTaskCreateOpen(false)}
            />

            <div className="task-board">
              {/* To Do */}
              <div className="task-column">
                <div className="task-column-header">
                  <div className="task-column-title">
                    <span className="task-status-dot todo" />
                    <h3>To Do</h3>
                  </div>

                  <span>{todoTasks.length}</span>
                </div>

                <div className="task-list">
                  {todoTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      members={memberList}
                      isMenuOpen={openTaskMenuId === task.id}
                      onMenuToggle={() =>
                        setOpenTaskMenuId((prevId) =>
                          prevId === task.id ? null : task.id
                        )
                      }
                      onMenuClose={() => setOpenTaskMenuId(null)}
                      onTitleChange={handleTaskTitleChange}
                      onStatusChange={handleTaskStatusChange}
                      onAssigneeChange={handleTaskAssigneeChange}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>

              {/* In Progress */}
              <div className="task-column">
                <div className="task-column-header">
                  <div className="task-column-title">
                    <span className="task-status-dot progress" />
                    <h3>In Progress</h3>
                  </div>

                  <span>{inProgressTasks.length}</span>
                </div>

                <div className="task-list">
                  {inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      members={memberList}
                      isMenuOpen={openTaskMenuId === task.id}
                      onMenuToggle={() =>
                        setOpenTaskMenuId((prevId) =>
                          prevId === task.id ? null : task.id
                        )
                      }
                      onMenuClose={() => setOpenTaskMenuId(null)}
                      onTitleChange={handleTaskTitleChange}
                      onStatusChange={handleTaskStatusChange}
                      onAssigneeChange={handleTaskAssigneeChange}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>

              {/* Done */}
              <div className="task-column">
                <div className="task-column-header">
                  <div className="task-column-title">
                    <span className="task-status-dot done" />
                    <h3>Done</h3>
                  </div>

                  <span>{doneTasks.length}</span>
                </div>

                <div className="task-list">
                  {doneTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      members={memberList}
                      isMenuOpen={openTaskMenuId === task.id}
                      onMenuToggle={() =>
                        setOpenTaskMenuId((prevId) =>
                          prevId === task.id ? null : task.id
                        )
                      }
                      onMenuClose={() => setOpenTaskMenuId(null)}
                      onTitleChange={handleTaskTitleChange}
                      onStatusChange={handleTaskStatusChange}
                      onAssigneeChange={handleTaskAssigneeChange}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Backend Health */}
          <section className="project-section project-health">
            <div className="project-section-header">
              <div>
                <h2>Backend Health</h2>
                <p className="project-section-description">
                  연결된 서비스 상태를 확인합니다.
                </p>
              </div>
            </div>

            <div className="health-summary">
              <div className="health-summary-item">
                <span>API Server</span>

                <div className="health-status healthy">
                  <span className="health-dot" />
                  정상
                </div>
              </div>

              <div className="health-summary-item">
                <span>응답 상태</span>
                <strong>200 OK</strong>
              </div>

              <div className="health-summary-item">
                <span>Environment</span>
                <strong>Development</strong>
              </div>
            </div>
          </section>
        </div>

        {/* Right Panel */}
        <aside className="project-side-panel">
          {/* Project Info */}
          <section className="project-side-card">
            <h2>프로젝트 정보</h2>

            <div className="project-info-list">
              <div className="project-info-row">
                <span>멤버</span>
                <strong>{memberList.length}명</strong>
              </div>

              <div className="project-info-row">
                <span>Task</span>
                <strong>{taskList.length}개</strong>
              </div>

              <div className="project-info-row">
                <span>최근 업데이트</span>
                <strong>{project.updatedAt}</strong>
              </div>
            </div>
          </section>

          {/* Members */}
          <section className="project-side-card">
            <div className="project-side-card-header">
              <h2>멤버</h2>

              <button
                type="button"
                className="project-member-add-button"
                onClick={() => setIsMemberCreateOpen(true)}
              >
                + 추가
              </button>
            </div>

            <MemberCreateModal
              isOpen={isMemberCreateOpen}
              onCreate={handleCreateMember}
              onClose={() => setIsMemberCreateOpen(false)}
            />

            {memberList.length === 0 ? (
              <p className="project-section-empty">
                등록된 멤버가 없습니다.
              </p>
            ) : (
              <div className="project-member-list">
                {memberList.map((member) => (
                  <div
                    key={member.id}
                    className="project-member-item"
                  >
                    <div className="project-member-avatar">
                      {member.name.charAt(0)}
                    </div>

                    <div className="project-member-info">
                      <strong>{member.name}</strong>
                      <span>{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Service Status */}
          <section className="project-side-card">
            <h2>서비스 상태</h2>

            <div className="service-status-list">
              <div className="service-status-item">
                <span>Backend</span>

                <div className="service-status-value">
                  <span className="service-dot healthy" />
                  정상
                </div>
              </div>

              <div className="service-status-item">
                <span>Database</span>

                <div className="service-status-value">
                  <span className="service-dot healthy" />
                  정상
                </div>
              </div>

              <div className="service-status-item">
                <span>Frontend</span>

                <div className="service-status-value">
                  <span className="service-dot healthy" />
                  정상
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )}

export default ProjectDetailPage