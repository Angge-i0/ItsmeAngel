import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL from env variable, falls back to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send cookies with requests
  timeout: 10000,
});

// ── Request interceptor: attach JWT ─────────────
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      // Redirect to login only if on an admin page
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

/* ── Auth ──────────────────────────────────────── */
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: ()           => api.post('/auth/logout'),
  me:     ()           => api.get('/auth/me'),
};

/* ── Projects ──────────────────────────────────── */
export const projectsAPI = {
  getAll:    ()         => api.get('/projects'),
  getOne:    (id)       => api.get(`/projects/${id}`),
  create:    (data)     => api.post('/projects', data),
  update:    (id, data) => api.put(`/projects/${id}`, data),
  remove:    (id)       => api.delete(`/projects/${id}`),
};

/* ── Skills ────────────────────────────────────── */
export const skillsAPI = {
  getAll:  ()         => api.get('/skills'),
  create:  (data)     => api.post('/skills', data),
  update:  (id, data) => api.put(`/skills/${id}`, data),
  remove:  (id)       => api.delete(`/skills/${id}`),
};

/* ── Messages ──────────────────────────────────── */
export const messagesAPI = {
  send:    (data)  => api.post('/messages', data),
  getAll:  ()      => api.get('/messages'),
  markRead:(id)    => api.patch(`/messages/${id}/read`),
  remove:  (id)    => api.delete(`/messages/${id}`),
};

export default api;
