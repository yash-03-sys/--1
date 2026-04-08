import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'Cannot reach the backend. Make sure the FastAPI server is running on port 8000.';
    } else if (error.response?.data?.detail) {
      error.message = error.response.data.detail;
    }
    return Promise.reject(error);
  },
);

export default api;
