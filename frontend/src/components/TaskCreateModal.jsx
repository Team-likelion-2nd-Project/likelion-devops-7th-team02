import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import './TaskCreateModal.css'

function TaskCreateModal({
  isOpen,
  members,
  onCreate,
  onClose,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const isFormValid = title.trim() !== ''

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setAssigneeId('')
    setError('')
  }

  const closeModal = () => {
    resetForm()
    onClose()
  }

  const handleCreate = async () => {
    if (!isFormValid || isSubmitting) return

    try {
      setIsSubmitting(true)
      setError('')

      await onCreate({
        title: title.trim(),
        description: description.trim(),
        assigneeId:
          assigneeId === ''
            ? null
            : Number(assigneeId),
      })

      closeModal()
    } catch (error) {
      setError(
        error.response?.data?.message ??
          '작업 생성에 실패했습니다.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div
      className="task-modal-overlay"
      onMouseDown={closeModal}
    >
      <div
        className="task-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="task-modal-header">
          <div>
            <h2>새 작업 만들기</h2>
            <p>작업의 기본 정보를 입력하세요.</p>
          </div>

          <button
            type="button"
            className="task-modal-close"
            onClick={closeModal}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task Title */}
        <div className="task-modal-field">
          <label htmlFor="task-title">
            작업 제목
          </label>

          <input
            id="task-title"
            type="text"
            maxLength={100}
            placeholder="작업 제목을 입력하세요."
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        {/* Task Description */}
        <div className="task-modal-field">
          <label htmlFor="task-description">
            작업 설명
          </label>

          <textarea
            id="task-description"
            rows="4"
            maxLength={1000}
            placeholder="작업 설명을 입력하세요."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        {/* Assignee */}
        <div className="task-modal-field">
          <label htmlFor="task-assignee">
            담당자
          </label>

          <select
            id="task-assignee"
            value={assigneeId}
            onChange={(event) =>
              setAssigneeId(event.target.value)
            }
          >
            <option value="">담당자 없음</option>

            {members.map((member) => (
              <option
                key={member.memberId}
                value={member.userId}
              >
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <p
            className="task-modal-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="task-modal-actions">
          <button
            type="button"
            className="task-modal-cancel"
            onClick={closeModal}
          >
            취소
          </button>

          <button
            type="button"
            className="task-modal-submit"
            disabled={!isFormValid || isSubmitting}
            onClick={handleCreate}
          >
            {isSubmitting
              ? '생성 중...'
              : '작업 생성'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TaskCreateModal