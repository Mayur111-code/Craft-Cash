// import axios from 'axios';

// const api = axios.create({
//     baseURL:  //"https://craft-cash.onrender.com/api" || 
//     "http://localhost:5000/api",
//     withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;


import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://craft-cash.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log for debugging
        if (error.code === 'ERR_NETWORK') {
            console.error('❌ Network Error - Server not reachable');
        }
        
        // Only redirect on 401 if user was previously authenticated
        // Don't redirect during initial app load
        if (error.response?.status === 401) {
            const token = localStorage.getItem('token');
            if (token) {
                // User had a token but it's invalid - clear and redirect
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            // If no token, just reject - don't redirect (prevents loop)
        }
        
        return Promise.reject(error);
    }
);

export default api;