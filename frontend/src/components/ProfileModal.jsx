import { createPortal } from 'react-dom'
import { Mail, User, UserRound, X } from 'lucide-react'

import './ProfileModal.css'

function ProfileModal({
  isOpen,
  user,
  onClose,
}) {
  if (!isOpen || !user) {
    return null
  }

  return createPortal(
    <div
      className="profile-modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="profile-modal-header">
          <div>
            <h2 id="profile-modal-title">
              내 프로필
            </h2>

            <p>
              현재 로그인한 사용자 정보입니다.
            </p>
          </div>

          <button
            type="button"
            className="profile-modal-close"
            aria-label="프로필 닫기"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="profile-modal-user">
          <div className="profile-modal-avatar">
            {user.name.charAt(0)}
          </div>

          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </div>

        <div className="profile-modal-info">
          <div className="profile-modal-info-item">
            <div className="profile-modal-info-icon">
              <UserRound size={18} />
            </div>

            <div>
              <span>이름</span>
              <strong>{user.name}</strong>
            </div>
          </div>

          <div className="profile-modal-info-item">
            <div className="profile-modal-info-icon">
              <Mail size={18} />
            </div>

            <div>
              <span>이메일</span>
              <strong>{user.email}</strong>
            </div>
          </div>

          <div className="profile-modal-info-item">
            <div className="profile-modal-info-icon">
              <User size={18} />
            </div>

            <div>
              <span>User ID</span>
              <strong>{user.userId}</strong>
            </div>
          </div>
        </div>

        <div className="profile-modal-footer">
          <button
            type="button"
            className="profile-modal-confirm"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ProfileModal