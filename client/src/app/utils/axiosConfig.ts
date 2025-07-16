import axios from 'axios';
import useUserStore from '../stores/useUserStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { user } = useUserStore.getState();
    const token = user.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export default axiosInstance;
