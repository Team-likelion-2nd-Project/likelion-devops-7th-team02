import { useContext, useState } from 'react'
import { X } from 'lucide-react'
import ProjectContext from '../context/ProjectContext'
import './ProjectCreateModal.css'

function ProjectCreateModal({
  isOpen,
  onClose,
}) {
  const { createProject } = useContext(ProjectContext)

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  if (!isOpen) return null

  const isFormValid = projectName.trim() !== ''

  const closeModal = () => {
    setProjectName('')
    setProjectDescription('')
    onClose()
  }

  const handleCreateProject = () => {
    if (!isFormValid) return

    createProject({
      name: projectName.trim(),
      description: projectDescription.trim(),
    })

    closeModal()
  }

  return (
    <div
      className="project-modal-overlay"
      onMouseDown={closeModal}
    >
      <div
        className="project-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="project-modal-header">
          <div>
            <h2>새 프로젝트 만들기</h2>
            <p>새 프로젝트의 기본 정보를 입력하세요.</p>
          </div>

          <button
            type="button"
            className="project-modal-close"
            onClick={closeModal}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="project-modal-field">
          <label htmlFor="project-name">
            프로젝트 이름
          </label>

          <input
            id="project-name"
            type="text"
            placeholder="프로젝트 이름을 입력하세요."
            value={projectName}
            onChange={(event) =>
              setProjectName(event.target.value)
            }
          />
        </div>

        <div className="project-modal-field">
          <label htmlFor="project-description">
            프로젝트 설명
          </label>

          <textarea
            id="project-description"
            rows="4"
            placeholder="프로젝트 설명을 입력하세요."
            value={projectDescription}
            onChange={(event) =>
              setProjectDescription(event.target.value)
            }
          />
        </div>

        <div className="project-modal-actions">
          <button
            type="button"
            className="project-modal-cancel"
            onClick={closeModal}
          >
            취소
          </button>

          <button
            type="button"
            className="project-modal-submit"
            disabled={!isFormValid}
            onClick={handleCreateProject}
          >
            프로젝트 생성
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectCreateModal