import axios from 'axios';

const API = axios.create({
  baseURL: 'https://crm-backend-qnzw.onrender.com'
});

export const getLeads = (params) => API.get('/api/leads', { params });
export const getLead = (id) => API.get(`/api/leads/${id}`);
export const createLead = (data) => API.post('/api/leads', data);
export const updateLead = (id, data) => API.put(`/api/leads/${id}`, data);
export const deleteLead = (id) => API.delete(`/api/leads/${id}`);
export const getStats = () => API.get('/api/leads/stats');