import axios from 'axios';

const baseURL = 'https://devanza.runasp.net/api';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Implement refresh token logic here
                // const refreshToken = localStorage.getItem('refreshToken');
                // const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
                // const { accessToken } = response.data;
                // localStorage.setItem('accessToken', accessToken);
                // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                // return axios(originalRequest);
            } catch (error) {
                // Handle refresh token error (e.g., logout user)
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;