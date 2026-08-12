import { useState } from 'react'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
} from 'lucide-react'
import TaskEditModal from './TaskEditModal'
import ConfirmModal from './ConfirmModal'
import './TaskCard.css'

function TaskCard({
  task,
  members,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onTitleChange,
  onStatusChange,
  onAssigneeChange,
  onDelete,
}) {

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEdit = () => {
    onMenuClose()
    setIsEditOpen(true)
  }

  const handleDelete = () => {
    onMenuClose()
    setIsDeleteOpen(true)
  }

  const handleEditSave = async ({
    title,
    status,
    assigneeId,
  }) => {
    if (status !== task.status) {
      await onStatusChange(
        task.id,
        status
      )
    }

    if (
      assigneeId !== null &&
      assigneeId !== task.assigneeId
    ) {
      await onAssigneeChange(
        task.id,
        assigneeId
      )
    }

    // 제목 수정 API는 아직 없으므로 로컬에서만 변경
    if (title !== task.title) {
      onTitleChange(task.id, title)
    }
  }

  const handleDeleteConfirm = () => {
    onDelete(task.id)
    setIsDeleteOpen(false)
  }

  return (
    <>
      <article className="task-card">
        <div className="task-card-header">
          <h3>{task.title}</h3>

          <div className="task-card-menu-wrapper">
            <button
              type="button"
              className="task-card-menu-button"
              aria-label="작업 메뉴"
              onClick={onMenuToggle}
            >
              <MoreHorizontal size={18} />
            </button>

            {isMenuOpen && (
              <div className="task-card-menu">
                <button
                  type="button"
                  onClick={handleEdit}
                >
                  <Pencil size={15} />
                  수정
                </button>

                <button
                  type="button"
                  className="task-card-menu-delete"
                  onClick={handleDelete}
                >
                  <Trash2 size={15} />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="task-card-footer">
          <div className="task-card-assignee">
            <div className="task-card-avatar">
              {task.assignee === '담당자 없음' ? (
                <UserRound size={14} />
              ) : (
                task.assignee.charAt(0)
              )}
            </div>

            <span>{task.assignee}</span>
          </div>
        </div>
      </article>

      {isEditOpen && (
        <TaskEditModal
          task={task}
          members={members}
          onSave={handleEditSave}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="작업 삭제"
        message={`"${task.title}" 작업을 삭제하시겠습니까?`}
        confirmText="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default TaskCard