
// import axios from "axios";
// const API_URL ="https://8080-debfabbeabddfcfffbdacddbfcdceaaffcc.premiumproject.examly.io/api/plans";
// export const addPlan = async (plan) => {
//  return await axios.post(`${API_URL}/addPlan`, plan);
// };

// export const getAllPlans = async () => {
//  return await axios.get(`${API_URL}/allPlans`);
// };

// export const getPlansByType = async (type) => {
//  return await axios.get(`${API_URL}/byType?type=${type}`);
// };

// export const getPlansSortedByPrice = async () => {
//  return await axios.get(`${API_URL}/sortedByPrice`);
// };

// export const deletePlan = async (id) => {
//  return await axios.delete(`${API_URL}/${id}`);
// };



import axios from "axios";
const API_URL ="http://localhost:8080/api/plans";
export const addPlan =  (plan) => {
 return  axios.post(`${API_URL}/addPlan`, plan);
};

export const getAllPlans =  () => {
 return  axios.get(`${API_URL}/allPlans`);
};

export const getPlansByType =  (type) => {
 return  axios.get(`${API_URL}/byType?type=${type}`);
};

export const getPlansSortedByPrice =  () => {
 return  axios.get(`${API_URL}/sortedByPrice`);
};

export const deletePlan =  (id) => {
 return  axios.delete(`${API_URL}/${id}`);
};


const API_BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const planAPI = {
  getAllPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/plan`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  },

  getPlanById: async (planId) => {
    const response = await fetch(`${API_BASE_URL}/plan/${planId}`);
    if (!response.ok) throw new Error('Failed to fetch plan');
    return response.json();
  },

  addPlan: async (plan) => {
    const response = await fetch(`${API_BASE_URL}/plan`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(plan),
    });
    if (!response.ok) throw new Error('Failed to add plan');
    return response.json();
  },

  updatePlan: async (planId, plan) => {
    const response = await fetch(`${API_BASE_URL}/plan/${planId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(plan),
    });
    if (!response.ok) throw new Error('Failed to update plan');
    return response.json();
  },

  deletePlan: async (planId) => {
    const response = await fetch(`${API_BASE_URL}/plan/${planId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete plan');
  },
};

export const subscriptionAPI = {
  createSubscription: async (planId) => {
    const response = await fetch(`${API_BASE_URL}/subscription`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ planId }),
    });
    if (!response.ok) throw new Error('Failed to create subscription');
    return response.json();
  },

  getUserSubscriptions: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/subscription/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  },

  cancelSubscription: async (subscriptionId) => {
    const response = await fetch(`${API_BASE_URL}/subscription/${subscriptionId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to cancel subscription');
    return response.json();
  },
};

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  registerUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  registerAdmin: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },
};

export const adminAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getAllSubscriptions: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/subscriptions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  },

  getAllTransactions: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/transactions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },
};
