import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import './MemberCreateModal.css'

function MemberCreateModal({
  isOpen,
  onCreate,
  onClose,
}) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const isFormValid = email.trim() !== ''

  const resetForm = () => {
    setEmail('')
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
        email: email.trim(),
      })

      closeModal()
    } catch (error) {
      setError(
        error.response?.data?.message ??
          '멤버 추가에 실패했습니다.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div
      className="member-modal-overlay"
      onMouseDown={closeModal}
    >
      <div
        className="member-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="member-modal-header">
          <div>
            <h2>멤버 추가</h2>

            <p>
              프로젝트에 추가할 사용자의 이메일을 입력하세요.
            </p>
          </div>

          <button
            type="button"
            className="member-modal-close"
            onClick={closeModal}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Email */}
        <div className="member-modal-field">
          <label htmlFor="member-email">
            이메일
          </label>

          <input
            id="member-email"
            type="email"
            autoComplete="email"
            placeholder="user@example.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="member-modal-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="member-modal-actions">
          <button
            type="button"
            className="member-modal-cancel"
            onClick={closeModal}
          >
            취소
          </button>

          <button
            type="button"
            className="member-modal-submit"
            disabled={!isFormValid || isSubmitting}
            onClick={handleCreate}
          >
            {isSubmitting
              ? '추가 중...'
              : '멤버 추가'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberCreateModal