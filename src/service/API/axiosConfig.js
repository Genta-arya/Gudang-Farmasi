import axios from 'axios';


const axiosConfig = {
  // baseURL: 'http://localhost:3001', 
  // baseURL: 'https://server-gudang.vercel.app',
  baseURL: 'http://192.168.0.106:3001',
  
  timeout: 50000, 
  headers: {
    'Content-Type': 'application/json'
  }
};


const apiClient = axios.create(axiosConfig);

export default apiClient;
