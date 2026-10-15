const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/employees';
const AUTH_BASE_URL = '/api/auth';

export const employeeService = {
  getAuthHeaders() {
    const token = localStorage.getItem('kloudspot_auth_header');
    if (token) {
      return { 'Authorization': token };
    }
    return {};
  },

  async login(username, password) {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: 'POST',
      credentials: 'include', // Spring Security HTTP Session cookie (JSESSIONID)
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Authentication failed. Please check credentials.');
    }
    const userData = result.data;
    localStorage.setItem('kloudspot_auth_header', userData.basicAuthHeader);
    localStorage.setItem('kloudspot_auth_user', JSON.stringify(userData));
    return userData;
  },

  async logout() {
    try {
      await fetch(`${AUTH_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: this.getAuthHeaders()
      });
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('kloudspot_auth_header');
      localStorage.removeItem('kloudspot_auth_user');
    }
  },

  getCurrentUser() {
    const raw = localStorage.getItem('kloudspot_auth_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    // Return null if not logged in - landing page will prompt for login
    return null;
  },

  async getEmployees({ search = '', department = '', status = '', page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }) {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (department && department !== 'ALL') params.append('department', department);
    if (status && status !== 'ALL') params.append('status', status);
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', sortBy);
    params.append('direction', direction);

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch employees');
    }
    const result = await response.json();
    return result.data;
  },

  async getEmployeeById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch employee details');
    }
    const result = await response.json();
    return result.data;
  },

  async createEmployee(employeeData) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(employeeData)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (err.validationErrors) {
        const firstErr = Object.values(err.validationErrors)[0];
        throw new Error(firstErr);
      }
      throw new Error(err.message || 'Failed to create employee');
    }
    const result = await response.json();
    return result.data;
  },

  async updateEmployee(id, employeeData) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers,
      body: JSON.stringify(employeeData)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (err.validationErrors) {
        const firstErr = Object.values(err.validationErrors)[0];
        throw new Error(firstErr);
      }
      throw new Error(err.message || 'Failed to update employee');
    }
    const result = await response.json();
    return result.data;
  },

  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete employee');
    }
    return true;
  },

  async getDepartments() {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) return { total: 0, active: 0, inactive: 0 };
    const result = await response.json();
    return result.data || { total: 0, active: 0, inactive: 0 };
  },

  async importCsv(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/import/csv`, {
      method: 'POST',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: formData
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'CSV Import failed');
    }
    return result.data;
  },

  getExportCsvUrl(search = '', department = '', status = '') {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (department && department !== 'ALL') params.append('department', department);
    if (status && status !== 'ALL') params.append('status', status);
    return `${API_BASE_URL}/export/csv?${params.toString()}`;
  }
};
