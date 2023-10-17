import axios from "axios"

const instance = axios.create({
    baseURL: import.meta.env.DEV ? import.meta.env.VITE_API_URL : "https://rm.has-bii.online/api",
    headers: { Accept: "application/json" },
    withCredentials: true,
    timeout: 5000,
})

export default instance
