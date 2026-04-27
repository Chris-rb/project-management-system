import axios from "axios"

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

httpClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error(`Error: ${error.response?.status}`)
        }
        if (error.response?.status === 500) {
            console.error(`Error: ${error.response?.status}`)
        }
        return Promise.reject(error)
    }
)