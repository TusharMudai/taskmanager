import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://18.205.191.227', // local
  //baseURL: 'http://3.26.96.188:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
