// Kloudspot Employee Management System - MongoDB Setup Script
db = db.getSiblingDB('employee_db');

print('--- Initializing MongoDB Collections & Indexes ---');

db.createCollection('employees');

// Create Unique Indexes
db.employees.createIndex({ "employeeId": 1 }, { unique: true });
db.employees.createIndex({ "email": 1 }, { unique: true });
db.employees.createIndex({ "department": 1 });
db.employees.createIndex({ "employmentStatus": 1 });

print('--- Created Indexes on employees Collection ---');
