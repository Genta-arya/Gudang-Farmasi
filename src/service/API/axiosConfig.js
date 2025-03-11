import axios from "axios";

const apiClient = axios.create({
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use((config) => {
  config.baseURL = `http://${localStorage.getItem("ip")}:3004`;
  return config;
});

export default apiClient;
