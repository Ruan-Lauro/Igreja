import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/',  
  timeout: 7000, 
});

export default axiosInstance;

//https://acampamento2025adv.netlify.app/api/
