import apiClient from "./API/axiosConfig"


export const getDataStokOpname = async () => {
    try {
        const respose = await apiClient.get('/stokopname')
        return respose.data
    } catch (error) {
        throw error
    }
}


export const getDetailAmprahan = async (data) => {
    try {
        const respose = await apiClient.post('/detail/permintaan' , data)
        return respose.data
    } catch (error) {
        throw error
    }
}