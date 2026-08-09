import './TaskCard.css'

function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      <div className="task-card-footer">
        <span>{task.assignee}</span>
      </div>
    </div>
  )
}

export default TaskCard
