import axios from 'axios';
import { getServerApiUrl } from './domainUtils';

const axiosInstance = axios.create({
  baseURL: getServerApiUrl(),
  withCredentials: true // send cookies
});

export default axiosInstance;
