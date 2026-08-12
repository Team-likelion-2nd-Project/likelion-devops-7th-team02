import { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const isFormValid = projectName.trim() !== ''

  const closeModal = () => {
    setProjectName('')
    setProjectDescription('')
    setError('')
    onClose()
  }

  const handleCreateProject = async () => {
    if (!isFormValid || isSubmitting) return

    try {
      setIsSubmitting(true)
      setError('')

      await createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
      })

      closeModal()
    } catch (error) {
      setError(
        error.response?.data?.message ??
          '프로젝트 생성에 실패했습니다.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div
      className="project-modal-overlay"
      onMouseDown={closeModal}
    >
      <div
        className="project-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="project-modal-header">
          <div>
            <h2>새 프로젝트 만들기</h2>
            <p>
              새 프로젝트의 기본 정보를 입력하세요.
            </p>
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

        {/* Project Name */}
        <div className="project-modal-field">
          <label htmlFor="project-name">
            프로젝트 이름
          </label>

          <input
            id="project-name"
            type="text"
            maxLength={100}
            placeholder="프로젝트 이름을 입력하세요."
            value={projectName}
            onChange={(event) =>
              setProjectName(event.target.value)
            }
          />
        </div>

        {/* Project Description */}
        <div className="project-modal-field">
          <label htmlFor="project-description">
            프로젝트 설명
          </label>

          <textarea
            id="project-description"
            rows="4"
            maxLength={500}
            placeholder="프로젝트 설명을 입력하세요."
            value={projectDescription}
            onChange={(event) =>
              setProjectDescription(event.target.value)
            }
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="project-modal-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Actions */}
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
            disabled={!isFormValid || isSubmitting}
            onClick={handleCreateProject}
          >
            {isSubmitting
              ? '생성 중...'
              : '프로젝트 생성'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ProjectCreateModal