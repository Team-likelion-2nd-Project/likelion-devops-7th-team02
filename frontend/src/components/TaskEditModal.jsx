import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import './TaskEditModal.css'

function TaskEditModal({
  task,
  members,
  onSave,
  onClose,
}) {
  const [title, setTitle] = useState(task.title)
  const [status, setStatus] = useState(task.status)
  const [assigneeId, setAssigneeId] = useState(
    task.assigneeId ?? ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isFormValid = title.trim() !== ''

  const handleSave = async () => {
    if (!isFormValid || isSubmitting) return

    try {
      setIsSubmitting(true)
      setError('')

      await onSave({
        title: title.trim(),
        status,
        assigneeId:
          assigneeId === ''
            ? null
            : Number(assigneeId),
      })

      onClose()
    } catch (error) {
      setError(
        error.response?.data?.message ??
          '작업 수정에 실패했습니다.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div
      className="task-edit-modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="task-edit-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="task-edit-modal-header">
          <div>
            <h2>작업 수정</h2>
            <p>작업 정보를 수정하세요.</p>
          </div>

          <button
            type="button"
            className="task-edit-modal-close"
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task Title */}
        <div className="task-edit-modal-field">
          <label htmlFor="edit-task-title">
            작업 제목
          </label>

          <input
            id="edit-task-title"
            type="text"
            maxLength={100}
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        {/* Status */}
        <div className="task-edit-modal-field">
          <label htmlFor="edit-task-status">
            상태
          </label>

          <select
            id="edit-task-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="TODO">
              To Do
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="DONE">
              Done
            </option>
          </select>
        </div>

        {/* Assignee */}
        <div className="task-edit-modal-field">
          <label htmlFor="edit-task-assignee">
            담당자
          </label>

          <select
            id="edit-task-assignee"
            value={assigneeId}
            onChange={(event) =>
              setAssigneeId(event.target.value)
            }
          >
            <option
              value=""
              disabled
            >
              담당자를 선택하세요
            </option>

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
            className="task-edit-modal-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="task-edit-modal-actions">
          <button
            type="button"
            className="task-edit-modal-cancel"
            onClick={onClose}
          >
            취소
          </button>

          <button
            type="button"
            className="task-edit-modal-submit"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSave}
          >
            {isSubmitting
              ? '저장 중...'
              : '저장'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TaskEditModal