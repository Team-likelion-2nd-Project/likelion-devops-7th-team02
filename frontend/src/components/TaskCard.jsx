import { useState } from 'react'
import './TaskCard.css'

function TaskCard({
  task,
  members,
  onTitleChange,
  onStatusChange,
  onAssigneeChange,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const handleSave = () => {
    if (editTitle.trim() === '') return

    onTitleChange(task.id, editTitle.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  return (
    <div className="task-card">
      {isEditing ? (
        <div className="task-edit-area">
          <input
            type="text"
            className="task-edit-input"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
          />

          <div className="task-edit-actions">
            <button
              type="button"
              className="task-edit-cancel"
              onClick={handleCancel}
            >
              취소
            </button>

            <button
              type="button"
              className="task-edit-save"
              onClick={handleSave}
              disabled={editTitle.trim() === ''}
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <div className="task-card-title">
          <h3>{task.title}</h3>

          <button
            type="button"
            className="task-edit-button"
            onClick={() => setIsEditing(true)}
          >
            수정
          </button>
        </div>
      )}

      <div className="task-card-field">
        <label>상태</label>

        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value)
          }
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="task-card-field">
        <label>담당자</label>

        <select
          value={
            task.assignee === '담당자 없음'
              ? ''
              : task.assignee
          }
          onChange={(event) =>
            onAssigneeChange(task.id, event.target.value)
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

      <div className="task-card-footer">
        <span>{task.assignee}</span>

        <button
          type="button"
          className="task-delete-button"
          onClick={() => onDelete(task.id)}
        >
          삭제
        </button>
      </div>
    </div>
  )
}

export default TaskCard