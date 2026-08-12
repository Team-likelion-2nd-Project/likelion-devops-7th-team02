import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProjectContext from '../context/ProjectContext'
import TaskCard from '../components/TaskCard'
import TaskCreateModal from '../components/TaskCreateModal'
import MemberCreateModal from '../components/MemberCreateModal'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  addMember,
  getMembers,
} from '../api/memberApi'
import {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTaskAssignee,
} from '../api/taskApi'
import { getHealth } from '../api/healthApi'
import { getProject } from '../api/projectApi'
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

function normalizeTask(task) {
  return {
    ...task,
    assignee:
      task.assigneeName ?? '담당자 없음',
  }
}

function ProjectDetailContent({ projectId }) {
  const {
    projectList,
    currentUser,
    isLoading: isProjectLoading,
    error: projectError,
  } = useContext(ProjectContext)

  const projectSummary = projectList.find(
    (project) => project.id === Number(projectId)
  )

  const [projectDetail, setProjectDetail] = useState(null)
  const [isProjectDetailLoading, setIsProjectDetailLoading] =
    useState(true)
  const [projectDetailError, setProjectDetailError] =
    useState('')

  const project =
    projectDetail ?? projectSummary

  // Member
  const [memberList, setMemberList] = useState([])
  const [isMemberCreateOpen, setIsMemberCreateOpen] = useState(false)
  const [isMemberLoading, setIsMemberLoading] = useState(true)
  const [memberError, setMemberError] = useState('')

  // Task
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false)
  const [taskList, setTaskList] = useState([])
  const [isTaskLoading, setIsTaskLoading] = useState(true)
  const [taskError, setTaskError] = useState('')
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null)

  // Health
  const [healthStatus, setHealthStatus] = useState(null)
  const [healthHttpStatus, setHealthHttpStatus] = useState(null)
  const [isHealthLoading, setIsHealthLoading] = useState(true)
  const [healthError, setHealthError] = useState('')

  const currentProjectMember = memberList.find(
    (member) =>
      member.userId === currentUser?.userId
  )

  const currentProjectRole =
    currentProjectMember?.role ?? null

  const isOwner =
    currentProjectRole === 'OWNER'

  useEffect(() => {
    let cancelled = false

    getProject(projectId)
      .then((response) => {
        if (cancelled) return

        setProjectDetail(response.data.data ?? null)
        setProjectDetailError('')
      })
      .catch((error) => {
        if (cancelled) return

        setProjectDetailError(
          error.response?.data?.message ??
            '프로젝트 상세 정보를 불러오지 못했습니다.'
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsProjectDetailLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

  useEffect(() => {
    let cancelled = false

    getMembers(projectId)
      .then((response) => {
        if (cancelled) return

        setMemberList(response.data.data ?? [])
      })
      .catch((error) => {
        if (cancelled) return

        setMemberError(
          error.response?.data?.message ??
            '프로젝트 멤버를 불러오지 못했습니다.'
        )
      })
      .finally(() => {
        if (!cancelled){
          setIsMemberLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

  useEffect(() => {
    let cancelled = false

    getTasks(projectId)
      .then((response) => {
        if (cancelled) return

        const tasks = response.data.data ?? []

        setTaskList(
          tasks.map(normalizeTask)
        )
      })
      .catch((error) => {
        if (cancelled) return

        setTaskError(
          error.response?.data?.message ??
            '작업 목록을 불러오지 못했습니다.'
        )
      })
      .finally(() => {
        if (!cancelled){
          setIsTaskLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

    useEffect(() => {
      let cancelled = false

      getHealth()
        .then((response) => {
          if (cancelled) return

          setHealthStatus(
            response.data?.status ?? 'UNKNOWN'
          )
          setHealthHttpStatus(response.status)
          setHealthError('')
          setIsHealthLoading(false)
        })
        .catch((error) => {
          if (cancelled) return

          setHealthStatus('DOWN')
          setHealthHttpStatus(
            error.response?.status ?? null
          )
          setHealthError(
            'Backend Health Check에 실패했습니다.'
          )
          setIsHealthLoading(false)
        })

      return () => {
        cancelled = true
      }
    }, [])

  const handleCreateMember = async ({ email }) => {
    const response = await addMember(
      projectId,
      { email }
    )

    const newMember = response.data.data

    setMemberList((prevMembers) => [
      ...prevMembers,
      newMember,
    ])

    return newMember
  }

  const handleCreateTask = async ({
    title,
    description,
    assigneeId,
  }) => {
    const response = await createTask(
      projectId,
      {
        title,
        description,
        assigneeId,
      }
    )

    const newTask = normalizeTask(
      response.data.data
    )

    setTaskList((prevTasks) => [
      ...prevTasks,
      newTask,
    ])

    return newTask
  }

  const handleTaskStatusChange = async (
    taskId,
    status
  ) => {
    const response = await updateTaskStatus(
      projectId,
      taskId,
      status
    )

    const updatedTask = normalizeTask(
      response.data.data
    )

    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? updatedTask
          : task
      )
    )

    return updatedTask
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

  const handleTaskAssigneeChange = async (
    taskId,
    assigneeId
  ) => {
    const response = await updateTaskAssignee(
      projectId,
      taskId,
      assigneeId
    )

    const updatedTask = normalizeTask(
      response.data.data
    )

    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? updatedTask
          : task
      )
    )

    return updatedTask
  }
  const handleDeleteTask = (taskId) => {
    setTaskList((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    )
  }

  if (isProjectLoading || isProjectDetailLoading ) {
    return (
      <div className="project-detail-page">
        <Loading />
      </div>
    )
  }

  if (projectError || projectDetailError) {
    return (
      <div className="project-detail-page">
        <ErrorMessage
          message={projectError || projectDetailError}
        />
      </div>
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

    const isBackendHealthy =
    healthStatus === 'UP'

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

            {isTaskLoading ? (
              <Loading />
            ) : taskError ? (
              <ErrorMessage message={taskError} />
            ) : (
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
            )}
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

                <div
                  className={`health-status ${
                    isBackendHealthy ? 'healthy' : ''
                  }`}
                >
                  <span className="health-dot" />

                  {isHealthLoading
                    ? '확인 중'
                    : isBackendHealthy
                      ? '정상'
                      : '오류'}
                </div>
              </div>

              <div className="health-summary-item">
                <span>응답 상태</span>

                <strong>
                  {isHealthLoading
                    ? '확인 중'
                    : healthHttpStatus
                      ? `${healthHttpStatus} ${
                          healthHttpStatus === 200
                            ? 'OK'
                            : 'ERROR'
                        }`
                      : '연결 실패'}
                </strong>
              </div>

              <div className="health-summary-item">
                <span>Environment</span>
                <strong>Development</strong>
              </div>
            </div>

            {healthError && (
              <p className="project-section-empty">
                {healthError}
              </p>
            )}


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

              {isOwner && (
                <button
                  type="button"
                  className="project-member-add-button"
                  onClick={() => setIsMemberCreateOpen(true)}
                >
                  + 추가
                </button>
              )}
            </div>

            {isOwner &&(
              <MemberCreateModal
                isOpen={isMemberCreateOpen}
                onCreate={handleCreateMember}
                onClose={() => setIsMemberCreateOpen(false)}
              />
            )}

            {isMemberLoading ? (
              <p className="project-section-empty">
                멤버를 불러오는 중입니다.
              </p>
            ) : memberError ? (
              <p className="project-section-empty">
                {memberError}
              </p>
            ) : memberList.length === 0 ? (
              <p className="project-section-empty">
                등록된 멤버가 없습니다.
              </p>
            ) : (
              <div className="project-member-list">
                {memberList.map((member) => (
                  <div
                    key={member.userId}
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
                  <span
                    className={`service-dot ${
                      isBackendHealthy ? 'healthy' : ''
                    }`}
                  />

                  {isHealthLoading
                    ? '확인 중'
                    : isBackendHealthy
                      ? '정상'
                      : '오류'}
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