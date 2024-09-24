import axios from 'axios';


const axiosConfig = {
  baseURL: 'http://localhost:3000', 
  timeout: 50000, 
  headers: {
    'Content-Type': 'application/json'
  }
};


const apiClient = axios.create(axiosConfig);

export default apiClient;
