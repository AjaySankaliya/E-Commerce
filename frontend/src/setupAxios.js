import axios from 'axios';
import store from './redux/store';
import { setUser } from './redux/userSlice';
import { toast } from 'sonner';

const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if error is 401 and we haven't retried yet
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        // Prevent infinite loops if refresh token endpoint itself returns 401
        if (originalRequest.url.includes('/auth/refresh-token')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          store.dispatch(setUser(null));
          toast.error('Session expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
            refreshToken
          });

          if (res.data.success) {
            const newAccessToken = res.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            // Update authorization header
            originalRequest.headers['Authorization'] = newAccessToken;
            
            // Retry the original request with new token
            return axios(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token failed or expired
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          store.dispatch(setUser(null));
          toast.error('Session expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
