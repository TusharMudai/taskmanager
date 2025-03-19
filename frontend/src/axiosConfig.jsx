import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://54.144.18.139', // local
  //baseURL: 'http://3.26.96.188:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
