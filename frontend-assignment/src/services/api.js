import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to requests
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

// Interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if error response exists
        if (error.response) {
            // Show error toast
            const message = error.response.data?.message || 'An error occurred';
            toast.error(message);

            // Optional: Handle 401 Unauthorized globally (e.g., logout)
            if (error.response.status === 401) {
                // Clear local storage or redirect to login if needed
                // localStorage.removeItem('token');
                // window.location.href = '/login'; 
            }
        } else {
            toast.error('Network Error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export default api;
