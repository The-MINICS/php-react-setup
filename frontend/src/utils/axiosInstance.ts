import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized access - please log in again.');
    } else if (error.response?.status === 403) {
      throw new Error('Forbidden - you do not have permission to access this resource.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;