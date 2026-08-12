import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
} from 'lucide-react'

import ProjectContext from '../context/ProjectContext'

import './Header.css'

function Header() {
  const navigate = useNavigate()
  const { currentUser } = useContext(ProjectContext)

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenType')

    setIsProfileOpen(false)
    navigate('/login')
  }

  return (
    <header className="main-header">
      {/* Logo */}
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

      {/* Search */}
      <div className="main-header-search">
        <Search size={18} />

        <input
          type="search"
          placeholder="검색..."
          aria-label="검색"
        />
      </div>

      {/* Header Actions */}
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

        {/* Profile */}
        <div className="main-header-profile">
          <button
            type="button"
            className="main-header-profile-button"
            onClick={() =>
              setIsProfileOpen((prev) => !prev)
            }
          >
            <div className="main-header-avatar">
              {currentUser?.name?.charAt(0) ?? 'U'}
            </div>

            <div className="main-header-user-info">
              <strong>
                {currentUser?.name ?? '사용자'}
              </strong>

              <span>
                {currentUser?.email ?? ''}
              </span>
            </div>

            <ChevronDown size={15} />
          </button>

          {isProfileOpen && (
            <div className="profile-menu">
              <div className="profile-menu-user">
                <div className="profile-menu-avatar">
                  {currentUser?.name?.charAt(0) ?? 'U'}
                </div>

                <div>
                  <strong>
                    {currentUser?.name ?? '사용자'}
                  </strong>

                  <span>
                    {currentUser?.email ?? ''}
                  </span>
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