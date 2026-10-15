import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Download, Loader2 } from 'lucide-react';
import { employeeService } from '../api/employeeService';

export default function CsvImportModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith('.csv')) {
        setErrorMsg('Please select a valid .csv file.');
        return;
      }
      setFile(selected);
      setErrorMsg('');
      setImportResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = 
      "Employee ID,Full Name,Email,Phone Number,Department,Designation,Date of Joining,Salary,Status\n" +
      "EMP-2001,Priya Sharma,priya.s@kloudspot.com,+91 9876543230,Engineering,Cloud Architect,2024-01-10,1200000.0,Active\n" +
      "EMP-2002,Rahul Nair,rahul.n@kloudspot.com,+91 9876543231,Marketing,Growth Marketing Manager,2023-11-15,850000.0,Active\n" +
      "EMP-1005,Vikram Malhotra,vikram.m@kloudspot.com,+91 9876543214,Finance,Lead Financial Analyst,2020-11-05,950000.0,Active";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kloudspot_employee_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg('Please select a CSV file to upload.');
      return;
    }
    setIsUploading(true);
    setErrorMsg('');
    try {
      const result = await employeeService.importCsv(file);
      setImportResult(result);
      if (onImportSuccess) {
        onImportSuccess(result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'CSV Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="corporate-modal-backdrop" onClick={handleClose}>
      <div className="corporate-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="corporate-modal-header">
          <div>
            <h2 className="corporate-modal-title">Import Employees via CSV</h2>
            <p className="corporate-modal-subtitle">Bulk onboard or synchronize employee records from a CSV file</p>
          </div>
          <button className="corporate-modal-close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className="corporate-modal-body" style={{ padding: '24px' }}>
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Download Template Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-color, #1a1a1f)',
            border: '1px solid var(--border-color, #27272a)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={18} style={{ color: '#0ea5e9' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #fff)' }}>Need formatting reference?</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #a1a1aa)' }}>Download pre-formatted Kloudspot CSV template</div>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="btn btn-outline-corporate"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={13} />
              <span>Template</span>
            </button>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border-color, #3f3f46)',
              borderRadius: '12px',
              padding: '32px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: file ? 'rgba(14, 165, 233, 0.05)' : 'transparent',
              transition: 'border-color 0.2s',
              marginBottom: '18px'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              style={{ display: 'none' }}
            />
            <Upload size={32} style={{ color: '#0ea5e9', margin: '0 auto 12px auto' }} />
            {file ? (
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary, #fff)', fontSize: '14px' }}>{file.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #a1a1aa)', marginTop: '4px' }}>
                  {(file.size / 1024).toFixed(1)} KB — Click to change file
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary, #fff)', fontSize: '14px' }}>
                  Click to select CSV file, or drag and drop
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #a1a1aa)', marginTop: '4px' }}>
                  Supports UTF-8 CSV with columns: Employee ID, Full Name, Email, Phone, Dept, Designation, Date of Joining, Salary, Status
                </div>
              </div>
            )}
          </div>

          {/* Import Success Summary */}
          {importResult && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, fontSize: '14px' }}>
                <CheckCircle2 size={18} />
                <span>Import Completed Successfully</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '12px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Total Rows</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{importResult.totalRows}</div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#10b981' }}>New Inserted</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981' }}>{importResult.importedCount}</div>
                </div>
                <div style={{ background: 'rgba(14, 165, 233, 0.15)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#0ea5e9' }}>Updated</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0ea5e9' }}>{importResult.updatedCount}</div>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#ef4444' }}>Skipped</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>{importResult.skippedCount}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="corporate-modal-footer" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-ghost" onClick={handleClose} disabled={isUploading}>
            {importResult ? 'Close' : 'Cancel'}
          </button>
          {!importResult && (
            <button
              className="btn btn-primary-corporate"
              onClick={handleUpload}
              disabled={!file || isUploading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              <span>{isUploading ? 'Importing Records...' : 'Upload & Import CSV'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
