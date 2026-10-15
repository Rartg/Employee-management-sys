# Kloudspot | Technical Assessment
## Project 1: Employee Management System (Full Stack)

[![Java 17](https://img.shields.io/badge/Java-17-orange.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![OpenAPI](https://img.shields.io/badge/Swagger-OpenAPI%203-yellow.svg)](http://localhost:8080/swagger-ui.html)
[![Tests](https://img.shields.io/badge/Unit%20Tests-10%20Passed-success.svg)]()

> Developed for the **Software Engineer / Backend (Freshers)** Technical Assessment at **Kloudspot India Private Limited**.

---

## 1. System Overview

A full-stack, enterprise-grade Employee Management System allowing administrators to seamlessly manage employee records through an intuitive, modern dashboard backed by high-performance Spring Boot RESTful APIs and MongoDB persistent storage.

### Key Features Implemented:
* **Full CRUD Operations:** Add employee, view detailed profiles, edit details, and delete records with safety confirmation prompts.
* **All 9 Required Attributes Stored:** `Employee ID`, `Full Name`, `Email Address`, `Phone Number`, `Department`, `Designation`, `Date of Joining`, `Salary`, and `Employment Status (Active/Inactive)`.
* **Search & Multi-Filter:** Real-time search across Employee Name, Email, and ID, combined with simultaneous filtering by Department and Employment Status.
* **Server-Side Pagination & Sorting:** Efficient database pagination (`Pageable` with `skip()`/`limit()`) and dynamic field sorting.
* **Mongock Database Migration & Automated Seeding:** Enterprise version-controlled Mongock ChangeUnits (`V001__CreateEmployeeIndexes` and `V002__SeedInitialEmployees`) establishing unique indexes on `email` and `employeeId` with distributed locking and seeding 12 realistic records.
* **Interactive API Documentation:** Live Swagger / OpenAPI 3 UI available at `http://localhost:8080/swagger-ui.html`.
* **Unit Testing:** 10 comprehensive unit tests covering the service-layer business logic using **JUnit 5** and **Mockito** (100% passing).
* **Bonus Enhancements Included:**
  * **Export to CSV:** One-click download of filtered employee lists into an RFC-4180 compliant CSV format.
  * **Docker Compose:** Complete one-command containerization (`docker-compose.yml`) running MongoDB, Spring Boot Backend, and React Frontend.

---

## 2. Architecture & Design

```
[Browser / React 18 + Vite]
        │
        │ HTTP REST (JSON)
        ▼
[EmployeeController (REST Endpoints & Validation)]
        │
        ▼
[EmployeeService (Business Logic & Duplicate Prevention)]
        │
        ▼
[EmployeeRepository (Spring Data MongoDB & Dynamic Criteria Queries)]
        │
        ▼
[MongoDB 8.0 (Persistent Storage with Unique Indexes on email & employeeId)]
```

### Layered Architecture:
* **Controller Layer:** Exposes versioned REST endpoints, enforces HTTP status conventions (`200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`, `409 Conflict`), and handles CORS.
* **Service Layer:** Encapsulates business logic, validates constraints (e.g., duplicate email/ID prevention, positive salary), and integrates `MongoTemplate` for dynamic regex search.
* **Repository Layer:** Extends `MongoRepository<Employee, String>` for high-throughput queries.
* **Global Exception Handler:** Centralized `@RestControllerAdvice` catching validation and business exceptions, returning standardized JSON error payloads.
* **Mongock Migration Engine:** Version-controlled `@ChangeUnit` migrations with distributed locking (`mongockChangeLog`), guaranteeing safe, idempotent index management and initial employee data seeding.

---

## 3. Technology Stack

* **Backend:** Java 17 (Eclipse Temurin), Spring Boot 3.3.4, Maven 3.9.9, Spring Data MongoDB, Lombok, Bean Validation.
* **Database:** MongoDB 8.0+ (NoSQL document store).
* **Documentation & Testing:** SpringDoc OpenAPI 3 / Swagger UI, JUnit 5, Mockito.
* **Frontend:** React 18, Vite 5, Lucide React Icons, Modern Vanilla CSS (Glassmorphism design system).
* **Containerization:** Docker & Docker Compose (Nginx reverse proxy).

---

## 4. Quick Start (Running Locally)

### Option A: Running with Docker Compose (Recommended - Single Command)
Ensure Docker Desktop is running, then run:

```bash
docker compose up --build
```

Access the applications:
* **Frontend Web Dashboard:** `http://localhost:3000`
* **Backend REST API:** `http://localhost:8080/api/employees`
* **Interactive Swagger UI:** `http://localhost:8080/swagger-ui.html`

---

### Option B: Running Without Docker (Direct Local Execution)

#### 1. Start MongoDB
Ensure MongoDB is running on `localhost:27017`:
```powershell
mongod --dbpath "E:\mongodb\data"
```

#### 2. Run Backend (Spring Boot)
In a new terminal:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
* The backend will start on port `8080`.
* The database migration will automatically run and seed 12 sample employees.
* Verify Swagger UI at: `http://localhost:8080/swagger-ui.html`.

#### 3. Run Frontend (React + Vite)
In another terminal:
```powershell
cd frontend
npm install
npm run dev
```
* Open your browser at: `http://localhost:5173`.

---

## 5. Running Service-Layer Unit Tests

Run the full automated test suite using Maven:

```powershell
cd backend
.\mvnw.cmd test
```

### Test Coverage Highlights:
* `createEmployee_Success`: Verifies successful creation of valid employee.
* `createEmployee_DuplicateEmployeeId_ThrowsException`: Enforces uniqueness on Employee ID.
* `createEmployee_DuplicateEmail_ThrowsException`: Enforces uniqueness on Email.
* `getEmployeeById_Success`: Fetches record when ID exists.
* `getEmployeeById_NotFound_ThrowsException`: Returns 404 exception when ID is missing.
* `updateEmployee_Success`: Tests salary and role updates.
* `updateEmployee_NotFound_ThrowsException`: Verifies update failure for invalid IDs.
* `deleteEmployee_Success`: Validates deletion logic.
* `deleteEmployee_NotFound_ThrowsException`: Verifies deletion failure for non-existent IDs.
* `getAllEmployees_WithPagination`: Tests `Pageable` and multi-criteria query construction.

---

## 6. REST API Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/employees` | Create a new employee | `201 Created` |
| `GET` | `/api/employees` | List employees (paginated, search, filter) | `200 OK` |
| `GET` | `/api/employees/{id}` | Get employee by database ID | `200 OK` |
| `PUT` | `/api/employees/{id}` | Update employee details | `200 OK` |
| `DELETE`| `/api/employees/{id}` | Delete employee record | `200 OK` |
| `GET` | `/api/employees/departments` | Get list of distinct departments | `200 OK` |
| `GET` | `/api/employees/stats` | Get employee summary counts | `200 OK` |
| `GET` | `/api/employees/export/csv` | Export filtered employee records to CSV | `200 OK (text/csv)`|

---

## 7. Postman Collection

A pre-configured Postman collection file is included in the project root:
* **File:** `postman_collection.json`
* **How to use:** Open Postman $
ightarrow$ Click **Import** $
ightarrow$ Select `postman_collection.json`.
* Contains 10 ready-to-run API requests with example request bodies.

---

## 8. Assessment Submission Details

* **Candidate Name:** Samarth
* **Role:** Software Engineer / Backend (Freshers)
* **Company:** Kloudspot India Private Limited
* **Submission Recipients:** `manjunatha.v@kloudspot.com`, CC: `hr.team@kloudspot.com`
