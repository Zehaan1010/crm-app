const BASE_URL = 'https://crm-backend-qnzw.onrender.com/api/leads';

export const getLeads = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  const response = await fetch(`${BASE_URL}?${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }

  return response.json();
};

export const getLead = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch lead');
  }

  return response.json();
};

export const createLead = async (data) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create lead');
  }

  return response.json();
};

export const updateLead = async (id, data) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update lead');
  }

  return response.json();
};

export const deleteLead = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete lead');
  }

  return response.json();
};

export const getStats = async () => {
  const response = await fetch(`${BASE_URL}/stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
};