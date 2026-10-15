import React from 'react';
import { Users, UserCheck, UserX, Building2, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats = { total: 0, active: 0, inactive: 0 }, departmentCount = 0 }) {
  const activePercent = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  return (
    <div className="kpi-grid">
      {/* Total Headcount */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">TOTAL HEADCOUNT</span>
          <div className="kpi-icon-box kpi-blue">
            <Users size={18} />
          </div>
        </div>
        <div className="kpi-body">
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-trend trend-positive">
            <TrendingUp size={13} />
            <span>All Global Records</span>
          </div>
        </div>
        <div className="kpi-progress-bar">
          <div className="kpi-progress-fill" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* Active Workforce */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">ACTIVE WORKFORCE</span>
          <div className="kpi-icon-box kpi-green">
            <UserCheck size={18} />
          </div>
        </div>
        <div className="kpi-body">
          <div className="kpi-value text-green">{stats.active}</div>
          <div className="kpi-trend trend-positive">
            <span>{activePercent}% Operational Ratio</span>
          </div>
        </div>
        <div className="kpi-progress-bar">
          <div className="kpi-progress-fill progress-green" style={{ width: `${activePercent}%` }}></div>
        </div>
      </div>

      {/* Inactive Records */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">OFFBOARDED / LEAVE</span>
          <div className="kpi-icon-box kpi-slate">
            <UserX size={18} />
          </div>
        </div>
        <div className="kpi-body">
          <div className="kpi-value text-slate">{stats.inactive}</div>
          <div className="kpi-trend">
            <span>Archived Status</span>
          </div>
        </div>
        <div className="kpi-progress-bar">
          <div className="kpi-progress-fill progress-slate" style={{ width: `${100 - activePercent}%` }}></div>
        </div>
      </div>

      {/* Active Departments */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">DEPARTMENTS</span>
          <div className="kpi-icon-box kpi-cyan">
            <Building2 size={18} />
          </div>
        </div>
        <div className="kpi-body">
          <div className="kpi-value">{departmentCount}</div>
          <div className="kpi-trend">
            <span>Cross-Functional Teams</span>
          </div>
        </div>
        <div className="kpi-progress-bar">
          <div className="kpi-progress-fill progress-cyan" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}
