import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import EmployeeFilter from './components/EmployeeFilter';
import EmployeeTable from './components/EmployeeTable';
import Pagination from './components/Pagination';
import EmployeeFormModal from './components/EmployeeFormModal';
import EmployeeDetailsModal from './components/EmployeeDetailsModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import Toast from './components/Toast';
import { employeeService } from './api/employeeService';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Day / Night Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kloudspot_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kloudspot_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch Employees Data
  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getEmployees({
        search,
        department,
        status,
        page: pageNumber,
        size: pageSize,
        sortBy,
        direction
      });
      setEmployees(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setIsConnected(true);
    } catch (err) {
      console.error(err);
      setIsConnected(false);
      showToast(err.message || 'Error connecting to Kloudspot API', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, department, status, pageNumber, pageSize, sortBy, direction]);

  // Fetch Stats & Departments
  const loadMetadata = async () => {
    try {
      const [deptList, statsData] = await Promise.all([
        employeeService.getDepartments(),
        employeeService.getStats()
      ]);
      setDepartments(deptList || []);
      setStats(statsData || { total: 0, active: 0, inactive: 0 });
    } catch (e) {
      console.error('Metadata fetch error:', e);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    loadMetadata();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadEmployees(), loadMetadata()]);
    setIsRefreshing(false);
    showToast('Directory refreshed.');
  };

  // Handlers
  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('');
    setStatus('');
    setPageNumber(0);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleEditEmployee = (emp) => {
    setSelectedEmployee(emp);
    setIsFormModalOpen(true);
  };

  const handleViewEmployee = (emp) => {
    setSelectedEmployee(emp);
    setIsDetailsModalOpen(true);
  };

  const handleDeletePrompt = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEmployee = async (formData) => {
    if (selectedEmployee) {
      await employeeService.updateEmployee(selectedEmployee.id, formData);
      showToast(`Record for ${formData.fullName} updated successfully!`);
    } else {
      await employeeService.createEmployee(formData);
      showToast(`Employee ${formData.fullName} onboarded successfully!`);
    }
    loadEmployees();
    loadMetadata();
  };

  const handleConfirmDelete = async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      showToast('Employee offboarded successfully.');
      loadEmployees();
      loadMetadata();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleExportCsv = () => {
    const url = employeeService.getExportCsvUrl(search, department, status);
    window.open(url, '_blank');
    showToast('Exporting employee directory to CSV...');
  };

  return (
    <div className="corporate-app">
      <Navbar
        onAddClick={handleAddEmployee}
        onExportClick={handleExportCsv}
        isConnected={isConnected}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="corporate-main">
        <div className="corporate-container">
          {/* Top KPI Metrics */}
          <StatsCards stats={stats} departmentCount={departments.length} />

          {/* Directory Search & Filter Controls */}
          <EmployeeFilter
            search={search}
            setSearch={(val) => { setSearch(val); setPageNumber(0); }}
            department={department}
            setDepartment={(val) => { setDepartment(val); setPageNumber(0); }}
            status={status}
            setStatus={(val) => { setStatus(val); setPageNumber(0); }}
            departments={departments}
            onReset={handleResetFilters}
            totalRecords={totalElements}
          />

          {/* Directory Data Table */}
          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            onView={handleViewEmployee}
            onEdit={handleEditEmployee}
            onDelete={handleDeletePrompt}
            sortBy={sortBy}
            direction={direction}
            onSort={handleSort}
          />

          {/* Pagination Controls */}
          <Pagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageChange={setPageNumber}
            onPageSizeChange={(newSize) => { setPageSize(newSize); setPageNumber(0); }}
          />
        </div>
      </main>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        departments={departments}
      />

      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        employee={selectedEmployee}
        onEditClick={handleEditEmployee}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        employee={selectedEmployee}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
