import { AlertTriangle, X } from 'lucide-react'
import './ConfirmModal.css'

function ConfirmModal({
  isOpen,
  title = '작업 삭제',
  message = '정말 진행하시겠습니까?',
  confirmText = '삭제',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <div
      className="confirm-modal-overlay"
      onMouseDown={onCancel}
    >
      <div
        className="confirm-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="confirm-modal-header">
          <div className="confirm-modal-icon">
            <AlertTriangle size={20} />
          </div>

          <div className="confirm-modal-title">
            <h2>{title}</h2>
            <p>{message}</p>
          </div>

          <button
            type="button"
            className="confirm-modal-close"
            onClick={onCancel}
            aria-label="닫기"
          >
            <X size={19} />
          </button>
        </div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-cancel"
            onClick={onCancel}
          >
            취소
          </button>

          <button
            type="button"
            className="confirm-modal-submit"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal