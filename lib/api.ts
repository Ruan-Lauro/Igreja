import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://acampamento2025adv.netlify.app/api/',  
  timeout: 7000, 
});

export default axiosInstance;

//https://acampamento2025adv.netlify.app/api/
//http://localhost:3000/api/
