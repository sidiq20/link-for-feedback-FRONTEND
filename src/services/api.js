import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://link-for-feedback--sidiqolasode5695-bddci582.leapcell.dev';

console.log('API_BASE_URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Log error for debugging
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: originalRequest?.url
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
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
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const AuthAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refresh_token: refreshToken }),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.get(`/api/auth/verify-email/${token}`),
  googleLogin: () => api.get('/api/auth/google'),
  googleCallback: (params) => api.get('/api/auth/google/callback', { params }),
};

export const FeedbackLinksAPI = {
  create: (linkData) => api.post('/api/links', linkData),
  list: () => api.get('/api/links/'),
  get: (linkId) => api.get(`/api/links/${linkId}`),
  update: (linkId, linkData) => api.put(`/api/links/${linkId}`, linkData),
  delete: (linkId) => api.delete(`/api/links/${linkId}`),
  toggleStatus: (linkId) => api.patch(`/api/links/${linkId}/toggle`),
};

export const FeedbackAPI = {
  list: (linkId) => api.get(`/api/feedback/link/${linkId}`),
  submit: (slug, feedbackData) => api.post(`/api/feedback/submit/${slug}`, feedbackData),
  get: (feedbackId) => api.get(`/api/feedback/${feedbackId}`),
  delete: (feedbackId) => api.delete(`/api/feedback/${feedbackId}`),
};

export const AnalyticsAPI = {
  getLinkAnalytics: (linkId) => api.get(`/api/analytics/link/${linkId}`),
  getOverview: () => api.get('/api/analytics/overview'),
};

export const AnonymousLinksAPI = {
  create: (linkData) => api.post('/api/anonymous-links', linkData),
  list: () => api.get('/api/anonymous-links/'),
  get: (linkId) => api.get(`/api/anonymous-links/${linkId}`),
  update: (linkId, linkData) => api.put(`/api/anonymous-links/${linkId}`, linkData),
  delete: (linkId) => api.delete(`/api/anonymous-links/${linkId}`),
  toggleStatus: (linkId) => api.patch(`/api/anonymous-links/${linkId}/toggle`),
};

export const AnonymousAPI = {
  list: (linkId) => api.get(`/api/anonymous/link/${linkId}`),
  submit: (slug, message) => api.post(`/api/anonymous/submit/${slug}`, { message }),
  get: (messageId) => api.get(`/api/anonymous/${messageId}`),
  delete: (messageId) => api.delete(`/api/anonymous/${messageId}`),
};

export const FormsAPI = {
  create: (formData) => api.post('/api/forms', formData),
  list: () => api.get('/api/forms/'),
  get: (formId) => api.get(`/api/forms/${formId}`),
  update: (formId, formData) => api.put(`/api/forms/${formId}`, formData),
  delete: (formId) => api.delete(`/api/forms/${formId}`),
  toggleStatus: (formId) => api.patch(`/api/forms/${formId}/toggle`),
};

export const FormLinksAPI = {
  create: (linkData) => api.post('/api/form-links', linkData),
  list: (formId) => api.get(`/api/form-links/form/${formId}`),
  get: (linkId) => api.get(`/api/form-links/${linkId}`),
  delete: (linkId) => api.delete(`/api/form-links/${linkId}`),
};

export const FormResponseAPI = {
  list: (formId) => api.get(`/api/form-response/form/${formId}`),
  results: (formId) => api.get(`/api/form-response/results/${formId}`),
  submit: (slug, data) => {
    console.log('FormResponseAPI.submit called with:', { slug, data });
    return api.post(`/api/form-response/submit/${slug}`, data);
  },
};

// Exam Management API (for examiners)
// NOTE: Backend registers at /api/exam_manage, NOT /api/exam/manage
export const ExamManageAPI = {
  create: (data) => api.post('/api/exam_manage/create', data),
  list: () => api.get('/api/exam_manage/list'),
  get: (examId) => api.get(`/api/exam_manage/${examId}`),
  update: (examId, data) => api.put(`/api/exam_manage/${examId}/update`, data),
  delete: (examId) => api.delete(`/api/exam_manage/${examId}/delete`),
  publish: (examId) => api.post(`/api/exam_manage/${examId}/publish`),
  clone: (examId) => api.post(`/api/exam_manage/${examId}/clone`),
  updateSettings: (examId, settings) => api.put(`/api/exam_manage/${examId}/settings`, { settings }),
  addQuestions: (examId, questions) => api.post(`/api/exam_manage/${examId}/questions`, { questions }),
  getQuestions: (examId) => api.get(`/api/exam_manage/${examId}/questions`),
  updateQuestion: (examId, questionId, data) => api.put(`/api/exam_manage/${examId}/questions/${questionId}`, data),
  deleteQuestion: (examId, questionId) => api.delete(`/api/exam_manage/${examId}/questions/${questionId}`),
};

// Exam Taking API (for students)  
// NOTE: Backend registers at /api/exam_take
export const ExamTakeAPI = {
  start: (examId) => api.post(`/api/exam_take/${examId}/start`),
  getQuestions: (examId) => api.get(`/api/exam_take/${examId}/question`),
  saveAnswer: (data) => api.post('/api/exam_take/answer', data),
  submit: (sessionId) => api.post('/api/exam_take/submit', { session_id: sessionId }),
  getSession: (sessionId) => api.get(`/api/exam_take/session/${sessionId}`),
  pauseSession: (sessionId) => api.post(`/api/exam_take/session/${sessionId}/pause`),
  resumeSession: (sessionId) => api.post(`/api/exam_take/session/${sessionId}/resume`),
};

// Exam Grading API
// NOTE: Backend registers at /api/exam_grading
export const ExamGradingAPI = {
  triggerGrading: (examId) => api.post(`/api/exam_grading/trigger/${examId}`),
  manualGrade: (examId, studentId, grades) => api.post(`/api/exam_grading/manual/${examId}/${studentId}`, grades),
  getResults: (examId) => api.get(`/api/exam_grading/${examId}/results`),
  getStudentResult: (examId, studentId) => api.get(`/api/exam_grading/${examId}/results/${studentId}`),
  updateStudentResult: (examId, studentId, data) => api.put(`/api/exam_grading/${examId}/results/${studentId}`, data),
  getAnalytics: (examId) => api.get(`/api/exam_grading/${examId}/analytics`),
  getItemAnalysis: (examId) => api.get(`/api/exam_grading/${examId}/item_analysis`),
};

// Proctoring API
export const ExamProctoringAPI = {
  getLogs: (sessionId) => api.get(`/api/proctoring/${sessionId}/logs`),
  getLiveStudents: (examId) => api.get(`/api/proctoring/${examId}/students/live`),
  flagIncident: (sessionId, reason) => api.post(`/api/proctoring/${sessionId}/flag`, { reason }),
};

// Exam Invite API
// NOTE: Backend registers at /api/exam_invite/
export const ExamInviteAPI = {
  searchUsers: (email) => api.get(`/api/exam_invite/search?email=${email}`),
  inviteExaminers: (examId, emails) => api.post(`/api/exam_invite/${examId}`, { examiner_emails: emails }),
  createInviteLink: (examId, data) => api.post(`/api/exam_invite/${examId}/create`, data),
  acceptInvite: (token) => api.post(`/api/exam_invite/accept/${token}`),
  revokeInvite: (inviteId) => api.post(`/api/exam_invite/${inviteId}/revoke`),
  removeExaminer: (examId, examinerId) => api.post(`/api/exam_invite/${examId}/remove_examiner`, { examiner_id: examinerId }),
  updatePermissions: (examId, examinerId, permissions) => api.post(`/api/exam_invite/${examId}/update_permissions`, { examiner_id: examinerId, permissions }),
  listExaminers: (examId) => api.get(`/api/exam_invite/${examId}/list`),
  listInvites: (examId) => api.get(`/api/exam_invite/${examId}/invites`),
  regenerateInvite: (examId, data) => api.post(`/api/exam_invite/${examId}/invite/regenerate`, data),
};

// Exam Results API
// NOTE: Backend registers at /api/exam_result/
export const ExamResultAPI = {
  getAllResults: (examId) => api.get(`/api/exam_result/${examId}/all/`),
  getStudentResults: (studentId) => api.get(`/api/exam_result/student/${studentId}/list`),
  getSessionResult: (sessionId) => api.get(`/api/exam_result/session/${sessionId}`),
  getRankings: (examId) => api.get(`/api/exam_result/${examId}/rankings`),
  getCertificate: (examId, studentId) => api.get(`/api/exam_result/${examId}/certificate/${studentId}`),
};

// Exam Portal API (student dashboard)
// NOTE: Backend registers at /api/exam_portal/
export const ExamPortalAPI = {
  dashboard: () => api.get('/api/exam_portal/dashboard'),
  proctorDashboard: (examId) => api.get(`/api/exam_portal/proctor_dashboard/${examId}`),
};

// Exam Registration API (for students to register for exams)
// NOTE: Backend registers at /api/exam/register
export const ExamRegistrationAPI = {
  register: (examCode) => api.post('/api/exam/register', { exam_code: examCode }),
  list: () => api.get('/api/exam/register/list'),
  unregister: (registrationId) => api.delete(`/api/exam/register/${registrationId}`),
  checkExam: (examCode) => api.get(`/api/exam/register/check/${examCode}`),
};


export default api;
