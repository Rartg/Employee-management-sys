import React from 'react';
import { Users, UserCheck, UserX, Briefcase } from 'lucide-react';

export default function StatsCards({ stats = { total: 0, active: 0, inactive: 0 }, departmentCount = 0 }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-total">
          <Users size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Employees</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-active">
          <UserCheck size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Employees</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-inactive">
          <UserX size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.inactive}</div>
          <div className="stat-label">Inactive Records</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-depts">
          <Briefcase size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{departmentCount}</div>
          <div className="stat-label">Active Departments</div>
        </div>
      </div>
    </div>
  );
}
