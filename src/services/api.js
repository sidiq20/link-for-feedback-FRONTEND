import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // || 'https://link-for-feedback-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const AuthAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  refresh: (data) => api.post('/auth/refresh', data),
  logout: (data) => api.post('/auth/logout', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const FeedbackLinksAPI = {
  create: (data) => api.post('/api/links', data),
  list: (params) => api.get('/api/links/links', { params }),
  get: (id) => api.get(`/api/links/${id}`),
  update: (id, data) => api.put(`/api/links/${id}`, data),
  delete: (id) => api.delete(`/api/links/${id}`),
  bySlug: (slug) => api.get(`/api/links/by-slug/${slug}`),
};

export const FeedbackAPI = {
  submit: (slug, data) => api.post(`/api/feedback/submit/${slug}`, data),
  list: (params) => api.get('/api/feedback/list', { params }),
  detail: (id) => api.get(`/api/feedback/${id}`),
  delete: (id) => api.delete(`/api/feedback/${id}`),
  linkFeedback: (linkId, params) => api.get(`/api/feedback/link/${linkId}`, { params }),
};

export const AnalyticsAPI = {
  overview: () => api.get('/api/analytics/overview'),
  trend: (days = 30) => api.get(`/api/analytics/feedback-trend?days=${days}`),
  linkAnalytics: (linkId) => api.get(`/api/analytics/link/${linkId}`),
};

export const AnonymousLinksAPI = {
  create: (data) => api.post('/api/anonymous-links/create', data),
  list: (params) => api.get('/api/anonymous-links/list', { params }),
  get: (id) => api.get(`/api/anonymous-links/id/${id}`),
  update: (id, data) => api.put(`/api/anonymous-links/${id}`, data),
  delete: (id) => api.delete(`/api/anonymous-links/${id}`),
  bySlug: (slug) => api.get(`/api/anonymous-links/slug/${slug}`),
};

export const AnonymousAPI = {
  submit: (slug, data) => api.post(`/api/anonymous/submit/${slug}`, data),
  list: (params) => api.get('/api/anonymous/list', { params }),
  detail: (id) => api.get(`/api/anonymous/message/${id}`),
  delete: (id) => api.delete(`/api/anonymous/${id}`),
};
export default api;