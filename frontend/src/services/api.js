import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('decisionledger_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh expired access tokens using the refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = window.localStorage.getItem('decisionledger_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh endpoint using standard axios to prevent loop
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        window.localStorage.setItem('decisionledger_token', accessToken);

        // Update Authorization header and retry the request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Clear local storage and redirect to login
        window.localStorage.removeItem('decisionledger_user');
        window.localStorage.removeItem('decisionledger_token');
        window.localStorage.removeItem('decisionledger_refresh_token');
        
        // Force redirect to auth page
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
