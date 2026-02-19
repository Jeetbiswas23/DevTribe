import axios from 'axios'

// Create axios instance
// Default to the deployed backend URL if VITE_API_URL is not provided.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://devtribe-backend.onrender.com/api',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})
// Requests now use HttpOnly cookie for auth (server sets cookie). No token is stored in localStorage.

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      if (status === 401) {
        // Unauthorized - no valid session; let the app handle it (avoid full page reload)
        console.warn('Unauthorized (401) response from API')
      }

      console.error('API Error:', data.error || error.message)
      return Promise.reject(data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response received', error)
      return Promise.reject({ error: 'Network error: No response received' })
    } else {
      // Something else happened
      console.error('Error:', error.message)
      return Promise.reject({ error: error.message })
    }
  }
)

// API methods
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
}

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getByUsername: (username) => api.get(`/users/${username}`),
  updateProfile: (data) => api.put('/users/profile', data),
  follow: (username) => api.post(`/users/${username}/follow`),
  unfollow: (username) => api.post(`/users/${username}/unfollow`),
  getFollowers: (username) => api.get(`/users/${username}/followers`),
  getFollowing: (username) => api.get(`/users/${username}/following`)
}

export const teamAPI = {
  create: (data) => api.post('/teams', data),
  getAll: (params) => api.get('/teams', { params }),
  getById: (id) => api.get(`/teams/${id}`),
  apply: (id, data) => api.post(`/teams/${id}/apply`, data),
  handleRequest: (teamId, userId, action) => api.post(`/teams/${teamId}/requests/${userId}/${action}`),
  removeMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
  delete: (id) => api.delete(`/teams/${id}`)
}

export const hackathonAPI = {
  create: (data) => api.post('/hackathons', data),
  getAll: (params) => api.get('/hackathons', { params }),
  getById: (id) => api.get(`/hackathons/${id}`),
  update: (id, data) => api.put(`/hackathons/${id}`, data),
  delete: (id) => api.delete(`/hackathons/${id}`),
  register: (id) => api.post(`/hackathons/${id}/register`),
  inviteJudge: (id, data) => api.post(`/hackathons/${id}/invite-judge`, data),
  judgeResponse: (id, data) => api.post(`/hackathons/${id}/judge-response`, data)
}

export const postAPI = {
  create: (data) => api.post('/posts', data),
  getFeed: (params) => api.get('/posts/feed', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  like: (id) => api.post(`/posts/${id}/like`),
  comment: (id, data) => api.post(`/posts/${id}/comment`, data),
  delete: (id) => api.delete(`/posts/${id}`)
}

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
}

export default api
