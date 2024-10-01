import apiClient from "./API/axiosConfig";




export const getDataLaporan = async (date) => {
    try {
        const response = await apiClient.post(`/report`,  date );
        return response.data;
    } catch (error) {
        throw error;
    }
}