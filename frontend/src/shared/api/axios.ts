import axios from "axios";
// import { logout } from "./authService";
import { logout } from "../../app/model/slices/authSlice";

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:8000/api/v1/users/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;

        localStorage.setItem('token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (error) {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default instance;