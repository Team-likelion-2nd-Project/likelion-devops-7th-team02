import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
} from 'lucide-react'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenType')

    setIsProfileOpen(false)
    navigate('/login')
  }

  return (
    <header className="main-header">
      <div className="main-header-left">
        <Link
          to="/projects"
          className="main-header-logo"
        >
          <div className="main-header-logo-icon">
            D
          </div>

          <strong>DevFlow</strong>
        </Link>
      </div>

      <div className="main-header-search">
        <Search size={18} />

        <input
          type="search"
          placeholder="검색..."
          aria-label="검색"
        />
      </div>

      <div className="main-header-actions">
        <button
          type="button"
          className="main-header-icon-button"
          aria-label="알림"
        >
          <Bell size={19} />
        </button>

        <button
          type="button"
          className="main-header-icon-button"
          aria-label="설정"
        >
          <Settings size={19} />
        </button>

        <div className="main-header-profile">
          <button
            type="button"
            className="main-header-profile-button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="main-header-avatar">
              U
            </div>

            <div className="main-header-user-info">
              <strong>사용자</strong>
              <span>Frontend</span>
            </div>

            <ChevronDown size={15} />
          </button>

          {isProfileOpen && (
            <div className="profile-menu">
              <div className="profile-menu-user">
                <div className="profile-menu-avatar">
                  U
                </div>

                <div>
                  <strong>사용자</strong>
                  <span>Frontend</span>
                </div>
              </div>

              <div className="profile-menu-divider" />

              <button
                type="button"
                className="profile-menu-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header