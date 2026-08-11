import { useState } from 'react'
import { X } from 'lucide-react'
import './TaskCreateModal.css'

function TaskCreateModal({
  isOpen,
  members,
  onCreate,
  onClose,
}) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('TODO')
  const [assignee, setAssignee] = useState('')

  if (!isOpen) return null

  const isFormValid = title.trim() !== ''

  const resetForm = () => {
    setTitle('')
    setStatus('TODO')
    setAssignee('')
  }

  const closeModal = () => {
    resetForm()
    onClose()
  }

  const handleCreate = () => {
    if (!isFormValid) return

    onCreate({
      title: title.trim(),
      status,
      assignee: assignee || '담당자 없음',
    })

    closeModal()
  }

  return (
    <div
      className="task-modal-overlay"
      onMouseDown={closeModal}
    >
      <div
        className="task-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
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

        <div className="task-modal-field">
          <label htmlFor="task-title">
            작업 제목
          </label>

          <input
            id="task-title"
            type="text"
            placeholder="작업 제목을 입력하세요."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="task-modal-field">
          <label htmlFor="task-status">
            상태
          </label>

          <select
            id="task-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="task-modal-field">
          <label htmlFor="task-assignee">
            담당자
          </label>

          <select
            id="task-assignee"
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
          >
            <option value="">담당자 없음</option>

            {members.map((member) => (
              <option
                key={member.id}
                value={member.name}
              >
                {member.name}
              </option>
            ))}
          </select>
        </div>

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
            disabled={!isFormValid}
            onClick={handleCreate}
          >
            작업 생성
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCreateModal