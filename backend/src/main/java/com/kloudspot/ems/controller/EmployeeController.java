package com.kloudspot.ems.controller;

import com.kloudspot.ems.dto.ApiResponse;
import com.kloudspot.ems.dto.EmployeeRequestDTO;
import com.kloudspot.ems.dto.EmployeeResponseDTO;
import com.kloudspot.ems.dto.PaginatedResponse;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employee Management", description = "Operations for managing employee records, search, filter, pagination, and export")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @Operation(summary = "Add a new employee", description = "Creates a new employee record after validating input and preventing duplicate email or ID.")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> createEmployee(
            @Valid @RequestBody EmployeeRequestDTO requestDTO) {
        EmployeeResponseDTO created = employeeService.createEmployee(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created successfully", created));
    }

    @GetMapping
    @Operation(summary = "List employees with search, filter, and pagination",
            description = "Fetch paginated employee records with optional full-text search by name/email and filtering by department and status.")
    public ResponseEntity<ApiResponse<PaginatedResponse<EmployeeResponseDTO>>> getAllEmployees(
            @Parameter(description = "Search keyword (matches name, email, or employeeId)")
            @RequestParam(required = false) String search,
            @Parameter(description = "Filter by department name")
            @RequestParam(required = false) String department,
            @Parameter(description = "Filter by employment status (Active or Inactive)")
            @RequestParam(required = false) EmploymentStatus status,
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc or desc)")
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        PaginatedResponse<EmployeeResponseDTO> response = employeeService.getAllEmployees(search, department, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Employees retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "View employee details", description = "Fetches a single employee record by their database ID.")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> getEmployeeById(
            @PathVariable String id) {
        EmployeeResponseDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success("Employee retrieved successfully", employee));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edit employee information", description = "Updates an existing employee's details with validation.")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> updateEmployee(
            @PathVariable String id,
            @Valid @RequestBody EmployeeRequestDTO requestDTO) {
        EmployeeResponseDTO updated = employeeService.updateEmployee(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an employee", description = "Deletes an employee record from persistent storage.")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(
            @PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully"));
    }

    @GetMapping("/departments")
    @Operation(summary = "Get all distinct departments", description = "Returns a list of all existing department names for filter dropdowns.")
    public ResponseEntity<ApiResponse<List<String>>> getDistinctDepartments() {
        List<String> departments = employeeService.getDistinctDepartments();
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", departments));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get employee statistics", description = "Returns total, active, and inactive employee counts.")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getEmployeeStats() {
        Map<String, Long> stats = employeeService.getEmployeeStats();
        return ResponseEntity.ok(ApiResponse.success("Employee stats retrieved successfully", stats));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export employee records to CSV (Bonus Feature)", description = "Exports filtered employee data into an RFC-4180 compliant CSV file.")
    public ResponseEntity<byte[]> exportToCsv(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) EmploymentStatus status) {

        List<EmployeeResponseDTO> list = employeeService.getAllEmployeesForExport(search, department, status);

        StringBuilder csv = new StringBuilder();
        csv.append("Employee ID,Full Name,Email,Phone Number,Department,Designation,Date of Joining,Salary,Status\n");

        for (EmployeeResponseDTO emp : list) {
            csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,\"%s\"\n",
                    emp.getEmployeeId(),
                    emp.getFullName().replace("\"", "\"\""),
                    emp.getEmail(),
                    emp.getPhoneNumber(),
                    emp.getDepartment(),
                    emp.getDesignation(),
                    emp.getDateOfJoining(),
                    emp.getSalary(),
                    emp.getEmploymentStatus()));
        }

        byte[] output = csv.toString().getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "employees_export.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(output);
    }
}
