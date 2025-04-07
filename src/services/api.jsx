import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_URL || window.location.origin,
  headers: {
    'Content-Type': 'application/json',
  },
});
// GET 요청 예시
// export const getUsers = () => api.get('/users');

export const getUsers = () => {
  return Promise.resolve({
    data: [
      { id: 1, name: '홍길동', email: 'hong@example.com' },
      { id: 2, name: '김영희', email: 'kim@example.com' },
      { id: 3, name: '이철수', email: 'lee@example.com' },
    ],
  });
};

// POST 요청 예시
export const createUser = (userData) => api.post('/users', userData);
