import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_URL || window.location.origin,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem('accessToken');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  get(url, params = {}) { return apiClient.get(url, { params }); },
  post(url, data = {}) { return apiClient.post(url, data); },
  put(url, data = {}) { return apiClient.put(url, data); },
  delete(url) { return apiClient.delete(url); }
};