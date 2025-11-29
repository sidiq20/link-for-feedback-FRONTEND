import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||  'http://172.20.10.7:5000' ||   'https://link-for-feedback--sidiqolasode5695-bddci582.leapcell.dev';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Enable sending cookies with requests
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
      
      try {
        // Refresh token is sent automatically via httpOnly cookie
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
          withCredentials: true,
        });
        
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const AuthAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
  refresh: () => api.post('/api/auth/refresh'),
  logout: () => api.post('/api/auth/logout'),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
  googleURL: () => api.get('/api/auth/google'),
  googleCallback: (code) => api.get(`/api/auth/google/callback?code=${code}`),
  sendVerificationEmail: () => api.post('/api/auth/send-verification'),
  verifyEmail: (token) => api.get(`/api/auth/verify-email/${token}`),
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

export const FormsAPI = {
  create: (data) => api.post('/api/forms/', data),
  list: () => api.get('/api/forms/'),
  get: (id) => api.get(`/api/forms/${id}`),
  update: (id, data) => api.put(`/api/forms/${id}`, data),
  delete: (id) => api.delete(`/api/forms/${id}`),
  results: (id) => api.get(`/api/forms/${id}/results`),
  vote: (id, data) => api.post(`/api/forms/${id}/vote`, data),
};

export const FormLinksAPI = {
  create: (formId, data) => api.post(`/api/form-links/${formId}`, data),
  bySlug: (slug) => api.get(`/api/form-links/slug/${slug}`),
};

export const FormResponseAPI = {
  list: (formId) => api.get(`/api/form-response/form/${formId}`),
  results: (formId) => api.get(`/api/form-response/results/${formId}`),
  submit: (slug, data) => {
    console.log('FormResponseAPI.submit called with:', { slug, data });
    return api.post(`/api/form-response/submit/${slug}`, data);
  },
};


export default api;
