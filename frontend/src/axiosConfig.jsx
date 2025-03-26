import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? process.env.REACT_APP_LOCAL_API_URL // Local environment
    : process.env.REACT_APP_LIVE_API_URL, // Live environment
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;