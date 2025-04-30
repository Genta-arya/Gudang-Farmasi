import apiClient from "./API/axiosConfig"


export const getDataStokOpname = async () => {
    try {
        const respose = await apiClient.get('/stokopname.php')
        return respose.data
    } catch (error) {
        throw error
    }
}


export const getDetailAmprahan = async (data) => {
    try {
        const respose = await apiClient.post('/detail.php' , data)
        return respose.data
    } catch (error) {
        throw error
    }
}