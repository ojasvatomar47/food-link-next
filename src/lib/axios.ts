import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: No longer accesses the store directly.
apiClient.interceptors.request.use(
  (config) => {
    // The Authorization header will be set manually via setAuthToken()
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// New utility function to set the Authorization header dynamically
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;
