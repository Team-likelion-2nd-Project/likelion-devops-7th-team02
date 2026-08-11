import './TaskCard.css'

function TaskCard({
  task,
  members,
  onStatusChange,
  onAssigneeChange,
  onDelete,
}) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>

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