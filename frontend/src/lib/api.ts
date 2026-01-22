import axios from 'axios';

// API URL: Use environment variable if set, otherwise fall back to localhost
const getApiUrl = () => {
    // In production or when NEXT_PUBLIC_API_URL is set, use it
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    // In development, use localhost
    return 'http://localhost:3001/api';
};

// Create axios instance
export const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Disable cookies for cross-origin requests to Render
});

// Request interceptor to add auth token AND set baseURL dynamically
api.interceptors.request.use(
    (config) => {
        // Set baseURL dynamically on each request
        config.baseURL = getApiUrl();

        // Add auth token
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const baseUrl = getApiUrl();
                    const response = await axios.post(`${baseUrl}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
