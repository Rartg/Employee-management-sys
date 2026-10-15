const RAW_URL = (import.meta.env.VITE_API_URL || '').trim();
const DEFAULT_PROD_BACKEND = 'https://employee-management-sys-0dpe.onrender.com';

const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BACKEND_URL = RAW_URL
  ? RAW_URL.replace(/\/api\/employees\/?$/, '').replace(/\/$/, '')
  : (!isLocal ? DEFAULT_PROD_BACKEND : '');

const API_BASE_URL = BACKEND_URL ? `${BACKEND_URL}/api/employees` : '/api/employees';
const AUTH_BASE_URL = BACKEND_URL ? `${BACKEND_URL}/api/auth` : '/api/auth';

async function parseResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
      throw new Error(`Connected to static host instead of backend API. Please configure VITE_API_URL to https://employee-management-sys-0dpe.onrender.com.`);
    }
    throw new Error(`Invalid response format from server (HTTP ${response.status}).`);
  }
}

export const employeeService = {
  getAuthHeaders() {
    const token = localStorage.getItem('kloudspot_auth_header');
    if (token) {
      return { 'Authorization': token };
    }
    return {};
  },

  async login(username, password) {
    let response;
    try {
      response = await fetch(`${AUTH_BASE_URL}/login`, {
        method: 'POST',
        credentials: 'include', // Spring Security HTTP Session cookie (JSESSIONID)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
    } catch (netErr) {
      throw new Error(`Unable to connect to backend server at ${AUTH_BASE_URL}. Check network connection or backend status.`);
    }

    const result = await parseResponse(response);

    if (!response.ok || !result.success) {
      if (response.status === 401) {
        throw new Error('Invalid credentials. Please verify your username / employee ID and password.');
      }
      throw new Error(result.message || `Authentication failed (HTTP ${response.status}).`);
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

    const result = await parseResponse(response);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch employees');
    }
    return result.data;
  },

  async getEmployeeById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    const result = await parseResponse(response);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch employee details');
    }
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

    const result = await parseResponse(response);

    if (!response.ok) {
      if (result.validationErrors) {
        const firstErr = Object.values(result.validationErrors)[0];
        throw new Error(firstErr);
      }
      throw new Error(result.message || 'Failed to create employee');
    }
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

    const result = await parseResponse(response);

    if (!response.ok) {
      if (result.validationErrors) {
        const firstErr = Object.values(result.validationErrors)[0];
        throw new Error(firstErr);
      }
      throw new Error(result.message || 'Failed to update employee');
    }
    return result.data;
  },

  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    const result = await parseResponse(response);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete employee');
    }
    return true;
  },

  async getDepartments() {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`, {
        credentials: 'include',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) return [];
      const result = await parseResponse(response);
      return result.data || [];
    } catch (e) {
      return [];
    }
  },

  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        credentials: 'include',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) return { total: 0, active: 0, inactive: 0 };
      const result = await parseResponse(response);
      return result.data || { total: 0, active: 0, inactive: 0 };
    } catch (e) {
      return { total: 0, active: 0, inactive: 0 };
    }
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

    const result = await parseResponse(response);

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
