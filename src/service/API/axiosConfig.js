import axios from "axios";

const apiClient = axios.create({
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gunakan `baseURL` yang selalu diperbarui dari `localStorage`
apiClient.interceptors.request.use((config) => {
  config.baseURL = `http://${localStorage.getItem("ip")}:3000`;
  return config;
});

export default apiClient;
