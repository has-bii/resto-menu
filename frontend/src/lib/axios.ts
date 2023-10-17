import axios from "axios"

const instance = axios.create({
    baseURL: import.meta.env.DEV ? import.meta.env.VITE_API_URL : process.env.APP_API_URL,
    headers: { Accept: "application/json" },
    withCredentials: true,
    timeout: 5000,
})

export default instance
