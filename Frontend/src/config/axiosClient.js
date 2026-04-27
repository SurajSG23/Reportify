import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER_URI,
    withCredentials: true
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { axiosClient };