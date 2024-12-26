import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://acampamentoadv.netlify.app/api/',  
  timeout: 5000, 
});

export default axiosInstance;
