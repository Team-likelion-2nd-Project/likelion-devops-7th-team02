import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  setAccessToken,
  setTokenType,
} from '../utils/authStorage'
import { login } from '../api/authApi'
import { Eye, EyeOff, X } from 'lucide-react'
import './Auth.css'

function LoginPage() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const isSessionExpired = searchParams.get('reason') === 'expired'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid =
    email.trim() !== '' &&
    password !== ''

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    setErrorMessage('')
    setIsLoading(true)

    try {
      const response = await login({
        email: email.trim(),
        password,
      })

      const { accessToken, tokenType } = response.data.data

      setAccessToken(accessToken)
      setTokenType(tokenType)

      navigate('/projects')
    } catch (error) {
      const message = error.response?.data?.message

      
      setErrorMessage(
        message ?? '요청 처리 중 오류가 발생했습니다.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>DevFlow</h1>
          <p>계정에 로그인하세요.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">이메일</label>

            <div className="email-input">
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
             {email && (
              <button
                type="button"
                className="email-clear"
                onClick={() => setEmail('')}
                aria-label="이메일 지우기"
              >
                <X size={18} />
              </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>

            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요."
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {isSessionExpired && !errorMessage && (
            <p className="auth-notice" role="status">
              로그인이 만료되었습니다. 다시 로그인해주세요.
            </p>
          )}

          {errorMessage && (
            <p className="auth-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="auth-button"
            type="submit"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-link">
          <span>계정이 없으신가요?</span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage