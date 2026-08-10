import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import EmptyState from '../components/EmptyState'
import { projects } from '../mocks/projects'
import './ProjectListPage.css'

function ProjectListPage() {
  const [projectList, setProjectList] = useState(projects)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  const isFormValid = projectName.trim() !== ''

  const closeCreateForm = () => {
    setIsCreateOpen(false)
    setProjectName('')
    setProjectDescription('')
  }
  const handleCreateProject = () => {
    if (!isFormValid) return

    const newProject = {
      id: Date.now(),
      name: projectName.trim(),
      description: projectDescription.trim(),
      memberCount: 1,
      taskCount: 0,
      updatedAt: '방금 전',
    }

    setProjectList((prevProjects) => [
      ...prevProjects,
      newProject,
    ])

    closeCreateForm()
  }

  return (
    <div className="project-list-page">
      <div className="project-list-header">
        <div>
          <h1>프로젝트</h1>
          <p>참여 중인 프로젝트를 확인하고 관리하세요.</p>
        </div>

        <button
          type="button"
          className="project-create-button"
          onClick={() => setIsCreateOpen(true)}
        >
          + 새 프로젝트
        </button>
      </div>

      {isCreateOpen && (
        <div className="project-create-form">
          <div className="project-create-form-header">
            <h2>새 프로젝트 만들기</h2>

            <button
              type="button"
              className="project-create-close"
              onClick={closeCreateForm}
            >
              ✕
            </button>
          </div>

          <div className="project-create-field">
            <label htmlFor="project-name">프로젝트 이름</label>
            <input
              id="project-name"
              type="text"
              placeholder="프로젝트 이름을 입력하세요."
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
          </div>

          <div className="project-create-field">
            <label htmlFor="project-description">프로젝트 설명</label>
            <textarea
              id="project-description"
              placeholder="프로젝트 설명을 입력하세요."
              rows="4"
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
            />
          </div>

          <div className="project-create-actions">
            <button
              type="button"
              className="project-create-cancel"
              onClick={closeCreateForm}
            >
              취소
            </button>

            <button
              type="button"
              className="project-create-submit"
              disabled={!isFormValid}
              onClick={handleCreateProject}
            >
              생성
            </button>
          </div>
        </div>
      )}

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
    </div>
  )
}

export default ProjectListPage