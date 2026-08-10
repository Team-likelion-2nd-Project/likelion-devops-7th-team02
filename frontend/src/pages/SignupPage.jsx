import { useState } from 'react'
import { signup } from '../api/authApi'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, X } from 'lucide-react'
import './Auth.css'

function SignupPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')

  const passwordMismatch =
  passwordConfirm !== '' && password !== passwordConfirm

  const isFormValid =
  name.trim() !== '' &&
  email.trim() !== '' &&
  password.length >= 8 &&
  passwordConfirm !== '' &&
  !passwordMismatch


  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    setErrorMessage('')
    setIsLoading(true)
    try {
      await signup({
        email: email.trim(),
        password,
        name: name.trim(),
      })
      navigate('/login')
    } catch (error) {
      const errorCode = error.response?.data?.code
      const message = error.response?.data?.message

      console.log(errorCode, message)
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
          <p>새 계정을 만들어보세요.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name */}
            <div className="form-group">
              <label htmlFor="name">이름</label>

              <input
                id="name"
                type="text"
                placeholder="이름을 입력하세요."
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

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
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password !== '' && password.length < 8 && (
              <p className="field-error">
                비밀번호는 최소 8자 이상이어야 합니다.
              </p>
            )}
          </div>

          {/* Password Confirm */}
          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>

            <div className="password-input">
              <input
                id="passwordConfirm"
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력하세요."
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                className={passwordMismatch ? 'input-error' : ''}
                aria-invalid={passwordMismatch}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                aria-label={
                  showPasswordConfirm
                    ? '비밀번호 확인 숨기기'
                    : '비밀번호 확인 보기'
                }
              >
                {showPasswordConfirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {passwordMismatch && (
              <p className="field-error">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>
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
            {isLoading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-link">
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage