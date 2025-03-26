const axiosInstance = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://54.144.18.139'  // local
    : 'http://3.26.96.188:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;