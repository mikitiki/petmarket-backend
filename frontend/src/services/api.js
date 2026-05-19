import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH
export const register = async (email, password, role) => {
  const response = await api.post('/auth/register', { email, password, role });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// SPECIALISTS
export const getSpecialists = async ({ city, specialization } = {}) => {
  const params = {};
  if (city) params.city = city;
  if (specialization) params.specialization = specialization;
  const response = await api.get('/specialists', { params });
  return response.data;
};

export const getSpecialistById = async (id) => {
  const response = await api.get(`/specialists/${id}`);
  return response.data;
};

// BOOKINGS
export const createBooking = async ({ specialist_id, date, time }) => {
  const response = await api.post('/bookings', { specialist_id, date, time });
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/me');
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data;
};

// PHOTO
export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/specialists/me/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// SERVICES
export const getSpecialistServices = async (specialistId) => {
  const response = await api.get(`/services/specialist/${specialistId}`);
  return response.data;
};

export const getMyServices = async () => {
  const response = await api.get('/services/mine');
  return response.data;
};

export const addService = async ({ name, description, price, duration }) => {
  const response = await api.post('/services/', { name, description, price, duration });
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

export default api;