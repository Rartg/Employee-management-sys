const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/employees';

export const employeeService = {
  async getEmployees({ search = '', department = '', status = '', page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' }) {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (department && department !== 'ALL') params.append('department', department);
    if (status && status !== 'ALL') params.append('status', status);
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', sortBy);
    params.append('direction', direction);

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch employees');
    }
    const result = await response.json();
    return result.data;
  },

  async getEmployeeById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch employee details');
    }
    const result = await response.json();
    return result.data;
  },

  async createEmployee(employeeData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
      method: 'DELETE'
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete employee');
    }
    return true;
  },

  async getDepartments() {
    const response = await fetch(`${API_BASE_URL}/departments`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) return { total: 0, active: 0, inactive: 0 };
    const result = await response.json();
    return result.data || { total: 0, active: 0, inactive: 0 };
  },

  getExportCsvUrl(search = '', department = '', status = '') {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (department && department !== 'ALL') params.append('department', department);
    if (status && status !== 'ALL') params.append('status', status);
    return `${API_BASE_URL}/export/csv?${params.toString()}`;
  }
};
