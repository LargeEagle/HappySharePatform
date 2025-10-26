import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const postsApi = {
  getPosts: (page = 1) => api.get(`/posts?page=${page}`),
  getPost: (id: string) => api.get(`/posts/${id}`),
  createPost: (data: FormData) => api.post('/posts', data),
  updatePost: (id: string, data: FormData) => api.put(`/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  likePost: (id: string) => api.post(`/posts/${id}/like`),
  savePost: (id: string) => api.post(`/posts/${id}/save`),
  reportPost: (id: string, reason: string) => 
    api.post(`/posts/${id}/report`, { reason }),
};