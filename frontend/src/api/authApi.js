import api from './axios'

// 회원가입
export const signup = (data) => {
  return api.post('/auth/signup', data)
}

// 로그인
export const login = (data) => {
  return api.post('/auth/login', data)
}