const API_BASE_URL = 'http://localhost:8080';

class AuthService {
  login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.userId);
      return data;
    } else {
      throw new Error('Login failed');
    }
  };

  register = async (email, password, role = 'USER') => {
    const endpoint = role === 'ADMIN' ? '/auth/register/admin' : '/auth/register/user';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return response.text();
  };

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  getCurrentUser = () => {
    return {
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role'),
      userId: localStorage.getItem('userId'),
    };
  };

  isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  isAdmin = () => {
    return localStorage.getItem('role') === 'ADMIN';
  };

  getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
}

export default new AuthService();