import apiClient from "./API/axiosConfig";

export const getDataAmprahan = async (date) => {
  try {
    const response = await apiClient.post(`/permintaan`, { date });
    return response.data;
  } catch (error) {
    throw error;
  }
};
