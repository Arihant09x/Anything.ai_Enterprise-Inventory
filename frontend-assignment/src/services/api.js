import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: 'https://product-enterprise.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const message = error.response.data?.message || 'An error occurred';
            toast.error(message);
        } else {
            toast.error('Network Error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export default api;
