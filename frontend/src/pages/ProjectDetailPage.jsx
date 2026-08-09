import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../mocks/projects'
import TaskCard from '../components/TaskCard'
import './ProjectDetailPage.css'

function ProjectDetailPage() {
  const { projectId } = useParams()

  const project = projects.find(
    (project) => project.id === Number(projectId)
  )

  // Member
  const [memberList, setMemberList] = useState(project?.members ?? [])
  const [isMemberCreateOpen, setIsMemberCreateOpen] = useState(false)
  const [memberName, setMemberName] = useState('')
  const [memberRole, setMemberRole] = useState('Frontend')

  // Task
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskStatus, setTaskStatus] = useState('TODO')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [taskList, setTaskList] = useState(project?.tasks ?? [])

  const isMemberFormValid = memberName.trim() !== ''
  const isTaskFormValid = taskTitle.trim() !== ''

  const closeMemberCreateForm = () => {
    setIsMemberCreateOpen(false)
    setMemberName('')
    setMemberRole('Frontend')
  }

  const handleCreateMember = () => {
    if (!isMemberFormValid) return

    const newMember = {
      id: Date.now(),
      name: memberName.trim(),
      role: memberRole,
    }

    setMemberList((prevMembers) => [
      ...prevMembers,
      newMember,
    ])

    closeMemberCreateForm()
  }

  const closeTaskCreateForm = () => {
    setIsTaskCreateOpen(false)
    setTaskTitle('')
    setTaskStatus('TODO')
    setTaskAssignee('')
  }

  const handleCreateTask = () => {
    if (!isTaskFormValid) return

    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      status: taskStatus,
      assignee: taskAssignee || '담당자 없음',
    }

    setTaskList((prevTasks) => [
      ...prevTasks,
      newTask,
    ])

    closeTaskCreateForm()
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

      <div className="project-summary">
        <div className="project-summary-card">
          <span>멤버</span>
          <strong>{memberList.length}명</strong>
        </div>

        <div className="project-summary-card">
          <span>Task</span>
          <strong>{taskList.length}개</strong>
        </div>

        <div className="project-summary-card">
          <span>최근 업데이트</span>
          <strong>{project.updatedAt}</strong>
        </div>
      </div>

      <div className="project-detail-content">
        {/* Task */}
        <section className="project-section">
          <div className="project-section-header">
            <h2>작업</h2>

            <button
              type="button"
              className="task-create-button"
              onClick={() => setIsTaskCreateOpen(true)}
            >
              + 작업 추가
            </button>
          </div>

          {isTaskCreateOpen && (
            <div className="task-create-form">
              <div className="task-create-form-header">
                <h3>새 작업 만들기</h3>

                <button
                  type="button"
                  className="task-create-close"
                  onClick={closeTaskCreateForm}
                >
                  ✕
                </button>
              </div>

              <div className="task-create-field">
                <label htmlFor="task-title">작업 제목</label>

                <input
                  id="task-title"
                  type="text"
                  placeholder="작업 제목을 입력하세요."
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                />
              </div>

              <div className="task-create-field">
                <label htmlFor="task-status">상태</label>

                <select
                  id="task-status"
                  value={taskStatus}
                  onChange={(event) => setTaskStatus(event.target.value)}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="task-create-field">
                <label htmlFor="task-assignee">담당자</label>

                <select
                  id="task-assignee"
                  value={taskAssignee}
                  onChange={(event) => setTaskAssignee(event.target.value)}
                >
                  <option value="">담당자 없음</option>

                  {memberList.map((member) => (
                    <option
                      key={member.id}
                      value={member.name}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="task-create-actions">
                <button
                  type="button"
                  className="task-create-cancel"
                  onClick={closeTaskCreateForm}
                >
                  취소
                </button>

                <button
                  type="button"
                  className="task-create-submit"
                  disabled={!isTaskFormValid}
                  onClick={handleCreateTask}
                >
                  생성
                </button>
              </div>
            </div>
          )}

          <div className="task-board">
            <div className="task-column">
              <div className="task-column-header">
                <h3>To Do</h3>
                <span>{todoTasks.length}</span>
              </div>

              <div className="task-list">
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                  />
                ))}
              </div>
            </div>

            <div className="task-column">
              <div className="task-column-header">
                <h3>In Progress</h3>
                <span>{inProgressTasks.length}</span>
              </div>

              <div className="task-list">
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                  />
                ))}
              </div>
            </div>

            <div className="task-column">
              <div className="task-column-header">
                <h3>Done</h3>
                <span>{doneTasks.length}</span>
              </div>

              <div className="task-list">
                {doneTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Member */}
        <section className="project-section">
          <div className="project-section-header">
            <h2>멤버</h2>

            <button
              type="button"
              className="project-member-add-button"
              onClick={() => setIsMemberCreateOpen(true)}
            >
              + 멤버 추가
            </button>
          </div>

          {isMemberCreateOpen && (
            <div className="project-member-create-form">
              <div className="project-member-form-field">
                <label htmlFor="member-name">이름</label>

                <input
                  id="member-name"
                  type="text"
                  value={memberName}
                  onChange={(event) => setMemberName(event.target.value)}
                />
              </div>

              <div className="project-member-form-field">
                <label htmlFor="member-role">역할</label>

                <select
                  id="member-role"
                  value={memberRole}
                  onChange={(event) => setMemberRole(event.target.value)}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Infra">Infra</option>
                  <option value="CI/CD">CI/CD</option>
                </select>
              </div>

              <div className="project-member-form-actions">
                <button
                  type="button"
                  className="project-member-form-cancel-button"
                  onClick={closeMemberCreateForm}
                >
                  취소
                </button>

                <button
                  type="button"
                  className="project-member-submit-button"
                  onClick={handleCreateMember}
                  disabled={!isMemberFormValid}
                >
                  추가
                </button>
              </div>
            </div>
          )}

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
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Health */}
        <section className="project-section">
          <h2>서비스 상태</h2>
          <p>Health 상태가 표시될 영역입니다.</p>
        </section>
      </div>
    </div>
  )
}

export default ProjectDetailPage