import axios from 'axios';

const api = axios.create({
  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;