import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 백엔드 서버의 URL로 변경
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;