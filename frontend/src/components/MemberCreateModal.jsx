import { useState } from 'react'
import { X } from 'lucide-react'
import './MemberCreateModal.css'

function MemberCreateModal({
  isOpen,
  onCreate,
  onClose,
}) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Frontend')

  if (!isOpen) return null

  const isFormValid = name.trim() !== ''

  const resetForm = () => {
    setName('')
    setRole('Frontend')
  }

  const closeModal = () => {
    resetForm()
    onClose()
  }

  const handleCreate = () => {
    if (!isFormValid) return

    onCreate({
      name: name.trim(),
      role,
    })

    closeModal()
  }

  return (
    <div
      className="member-modal-overlay"
      onMouseDown={closeModal}
    >
      <div
        className="member-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="member-modal-header">
          <div>
            <h2>멤버 추가</h2>
            <p>프로젝트에 참여할 멤버 정보를 입력하세요.</p>
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

        <div className="member-modal-field">
          <label htmlFor="member-name">
            이름
          </label>

          <input
            id="member-name"
            type="text"
            placeholder="멤버 이름을 입력하세요."
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="member-modal-field">
          <label htmlFor="member-role">
            역할
          </label>

          <select
            id="member-role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Infra">Infra</option>
            <option value="CI/CD">CI/CD</option>
          </select>
        </div>

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
            disabled={!isFormValid}
            onClick={handleCreate}
          >
            멤버 추가
          </button>
        </div>
      </div>
    </div>
  )
}

export default MemberCreateModal