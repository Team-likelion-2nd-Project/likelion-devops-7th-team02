import TaskCard from './TaskCard'
import TaskCreateModal from './TaskCreateModal'
import Loading from './Loading'
import ErrorMessage from './ErrorMessage'

const TASK_COLUMNS = [
  {
    status: 'TODO',
    title: 'To Do',
    dotClass: 'todo',
  },
  {
    status: 'IN_PROGRESS',
    title: 'In Progress',
    dotClass: 'progress',
  },
  {
    status: 'DONE',
    title: 'Done',
    dotClass: 'done',
  },
]

function TaskBoard({
  taskList,
  memberList,
  isTaskCreateOpen,
  isTaskLoading,
  taskError,
  openTaskMenuId,
  onOpenTaskCreate,
  onCloseTaskCreate,
  onCreateTask,
  onMenuToggle,
  onMenuClose,
  onTitleChange,
  onStatusChange,
  onAssigneeChange,
  onDelete,
}) {
  const renderTask = (task) => (
    <TaskCard
      key={task.id}
      task={task}
      members={memberList}
      isMenuOpen={openTaskMenuId === task.id}
      onMenuToggle={() =>
        onMenuToggle(task.id)
      }
      onMenuClose={onMenuClose}
      onTitleChange={onTitleChange}
      onStatusChange={onStatusChange}
      onAssigneeChange={onAssigneeChange}
      onDelete={onDelete}
    />
  )

  return (
    <section className="project-section project-board-section">
      <div className="project-section-header">
        <div>
          <h2>작업 보드</h2>

          <p className="project-section-description">
            프로젝트 작업 진행 상황을 확인하세요.
          </p>
        </div>

        <button
          type="button"
          className="task-create-button"
          onClick={onOpenTaskCreate}
        >
          + 작업 추가
        </button>
      </div>

      <TaskCreateModal
        isOpen={isTaskCreateOpen}
        members={memberList}
        onCreate={onCreateTask}
        onClose={onCloseTaskCreate}
      />

      {isTaskLoading ? (
        <Loading />
      ) : taskError ? (
        <ErrorMessage message={taskError} />
      ) : (
        <div className="task-board">
          {TASK_COLUMNS.map((column) => {
            const tasks = taskList.filter(
              (task) =>
                task.status === column.status
            )

            return (
              <div
                key={column.status}
                className="task-column"
              >
                <div className="task-column-header">
                  <div className="task-column-title">
                    <span
                      className={`task-status-dot ${column.dotClass}`}
                    />

                    <h3>{column.title}</h3>
                  </div>

                  <span>{tasks.length}</span>
                </div>

                <div className="task-list">
                  {tasks.map(renderTask)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TaskBoard