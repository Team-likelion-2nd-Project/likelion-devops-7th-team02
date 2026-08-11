import { useState } from 'react'
import { X } from 'lucide-react'
import './TaskEditModal.css'

function TaskEditModal({
  task,
  members,
  onSave,
  onClose,
}) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('TODO')
  const [assignee, setAssignee] = useState(
    task.assignee === '담당자 없음'
      ? ''
      : task.assignee
  )

  const isFormValid = title.trim() !== ''

  const handleSave = () => {
    if (!isFormValid) return

    onSave({
      title: title.trim(),
      status,
      assignee,
    })

    onClose()
  }

  return (
    <div
      className="task-edit-modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="task-edit-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
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

        <div className="task-edit-modal-field">
          <label htmlFor="edit-task-title">
            작업 제목
          </label>

          <input
            id="edit-task-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

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
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">
              In Progress
            </option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="task-edit-modal-field">
          <label htmlFor="edit-task-assignee">
            담당자
          </label>

          <select
            id="edit-task-assignee"
            value={assignee}
            onChange={(event) =>
              setAssignee(event.target.value)
            }
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
            disabled={!isFormValid}
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskEditModal