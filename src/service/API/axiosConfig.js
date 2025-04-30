import axios from "axios";

const apiClient = axios.create({
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: `http://30.30.30.190/api/gudang-server/service`,
});

export default apiClient;
