import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  Search,
  Settings,
  UserRound,
} from 'lucide-react'

import {
  clearAuthStorage,
  getAccessToken,
} from '../utils/authStorage'

import ProjectContext from '../context/ProjectContext'
import ProfileModal from './ProfileModal'

import './Header.css'

function Header() {
  const navigate = useNavigate()
  const { currentUser } = useContext(ProjectContext)

  const [isProfileMenuOpen, setIsProfileMenuOpen] =
    useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] =
    useState(false)

  const accessToken = getAccessToken()

  const hasToken = Boolean(accessToken)
  const isLoggedIn =
    Boolean(hasToken && currentUser)

  const handleLogin = () => {
    setIsProfileMenuOpen(false)
    navigate('/login', {
      replace: true,
    })
  }

  const handleLogout = () => {
    clearAuthStorage()

    setIsProfileMenuOpen(false)
    setIsProfileModalOpen(false)

    navigate('/login', {
      replace: true,
    })
  }

  const handleProfileOpen = () => {
    setIsProfileMenuOpen(false)
    setIsProfileModalOpen(true)
  }

  return (
    <>
      <header className="main-header">
        {/* Logo */}
        <div className="main-header-left">
          <Link
            to={hasToken ? '/projects' : '/login'}
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
                setIsProfileMenuOpen(
                  (prev) => !prev
                )
              }
            >
              <div className="main-header-avatar">
                {isLoggedIn
                  ? currentUser.name.charAt(0)
                  : 'U'}
              </div>

              <div className="main-header-user-info">
                <strong>
                  {!hasToken
                    ? '로그인이 필요합니다'
                    : currentUser
                      ? currentUser.name
                      : '사용자 정보 확인 중...'}
                </strong>

                <span>
                  {isLoggedIn
                    ? currentUser.email
                    : ''}
                </span>
              </div>

              <ChevronDown size={15} />
            </button>

            {isProfileMenuOpen && (
              <div className="profile-menu">
                <div className="profile-menu-user">
                  <div className="profile-menu-avatar">
                    {isLoggedIn
                      ? currentUser.name.charAt(0)
                      : 'U'}
                  </div>

                  <div>
                    <strong>
                      {isLoggedIn
                        ? currentUser.name
                        : '로그인이 필요합니다'}
                    </strong>

                    <span>
                      {isLoggedIn
                        ? currentUser.email
                        : '로그인 후 이용해주세요.'}
                    </span>
                  </div>
                </div>

                <div className="profile-menu-divider" />

                {isLoggedIn ? (
                  <>
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={handleProfileOpen}
                    >
                      <UserRound size={17} />
                      내 프로필
                    </button>

                    <button
                      type="button"
                      className="profile-menu-logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={17} />
                      로그아웃
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="profile-menu-login"
                    onClick={handleLogin}
                  >
                    <LogIn size={17} />
                    로그인
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        user={currentUser}
        onClose={() =>
          setIsProfileModalOpen(false)
        }
      />
    </>
  )
}

export default Header