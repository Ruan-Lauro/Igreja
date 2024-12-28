import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://acampamento2025adv.netlify.app/api/',  
  timeout: 5000, 
});

export default axiosInstance;
