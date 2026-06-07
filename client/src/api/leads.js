import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getLeads = (params) => API.get('/leads', { params });
export const getLead = (id) => API.get(`/leads/${id}`);
export const createLead = (data) => API.post('/leads', data);
export const updateLead = (id, data) => API.put(`/leads/${id}`, data);
export const deleteLead = (id) => API.delete(`/leads/${id}`);
export const getStats = () => API.get('/leads/stats');
