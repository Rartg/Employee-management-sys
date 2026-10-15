package com.kloudspot.ems.service;

import com.kloudspot.ems.dto.EmployeeRequestDTO;
import com.kloudspot.ems.dto.EmployeeResponseDTO;
import com.kloudspot.ems.dto.PaginatedResponse;
import com.kloudspot.ems.exception.DuplicateResourceException;
import com.kloudspot.ems.exception.ResourceNotFoundException;
import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kloudspot.ems.dto.CsvImportResultDTO;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    @Override
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO) {
        String trimmedEmpId = requestDTO.getEmployeeId() != null ? requestDTO.getEmployeeId().trim().toUpperCase() : "";
        String trimmedEmail = requestDTO.getEmail() != null ? requestDTO.getEmail().trim().toLowerCase() : "";

        log.info("Creating new employee with employeeId: {}, email: {}", trimmedEmpId, trimmedEmail);

        if (employeeRepository.existsByEmployeeId(trimmedEmpId)) {
            throw new DuplicateResourceException("Employee with ID '" + trimmedEmpId + "' already exists");
        }
        if (employeeRepository.existsByEmail(trimmedEmail)) {
            throw new DuplicateResourceException("Employee with email '" + trimmedEmail + "' already exists");
        }

        Employee employee = Employee.builder()
                .employeeId(trimmedEmpId)
                .fullName(requestDTO.getFullName() != null ? requestDTO.getFullName().trim() : "")
                .email(trimmedEmail)
                .phoneNumber(requestDTO.getPhoneNumber() != null ? requestDTO.getPhoneNumber().trim() : "")
                .department(requestDTO.getDepartment() != null ? requestDTO.getDepartment().trim() : "")
                .designation(requestDTO.getDesignation() != null ? requestDTO.getDesignation().trim() : "")
                .dateOfJoining(requestDTO.getDateOfJoining())
                .salary(requestDTO.getSalary())
                .employmentStatus(requestDTO.getEmploymentStatus())
                .role("ROLE_EMPLOYEE")
                .password(passwordEncoder.encode(
                        requestDTO.getPassword() != null && !requestDTO.getPassword().isBlank()
                                ? requestDTO.getPassword().trim()
                                : "testing@123"
                ))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Employee saved = employeeRepository.save(employee);
        log.info("Employee created successfully with database ID: {}", saved.getId());
        return EmployeeResponseDTO.fromEntity(saved);
    }

    @Override
    public EmployeeResponseDTO getEmployeeById(String id) {
        log.debug("Fetching employee by ID: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with ID '" + id + "' not found"));
        return EmployeeResponseDTO.fromEntity(employee);
    }

    @Override
    public EmployeeResponseDTO updateEmployee(String id, EmployeeRequestDTO requestDTO) {
        log.info("Updating employee with ID: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with ID '" + id + "' not found"));

        String trimmedEmpId = requestDTO.getEmployeeId().trim().toUpperCase();
        String trimmedEmail = requestDTO.getEmail().trim().toLowerCase();

        if (employeeRepository.existsByEmployeeIdAndIdNot(trimmedEmpId, id)) {
            throw new DuplicateResourceException("Employee with ID '" + trimmedEmpId + "' is already assigned to another employee");
        }
        if (employeeRepository.existsByEmailAndIdNot(trimmedEmail, id)) {
            throw new DuplicateResourceException("Employee with email '" + trimmedEmail + "' is already assigned to another employee");
        }

        employee.setEmployeeId(trimmedEmpId);
        employee.setFullName(requestDTO.getFullName().trim());
        employee.setEmail(trimmedEmail);
        employee.setPhoneNumber(requestDTO.getPhoneNumber().trim());
        employee.setDepartment(requestDTO.getDepartment().trim());
        employee.setDesignation(requestDTO.getDesignation().trim());
        employee.setDateOfJoining(requestDTO.getDateOfJoining());
        employee.setSalary(requestDTO.getSalary());
        employee.setEmploymentStatus(requestDTO.getEmploymentStatus());
        employee.setUpdatedAt(LocalDateTime.now());

        Employee updated = employeeRepository.save(employee);
        log.info("Employee updated successfully: {}", updated.getId());
        return EmployeeResponseDTO.fromEntity(updated);
    }

    @Override
    public void deleteEmployee(String id) {
        log.info("Deleting employee with ID: {}", id);
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee with ID '" + id + "' not found");
        }
        employeeRepository.deleteById(id);
        log.info("Employee deleted successfully: {}", id);
    }

    @Override
    public PaginatedResponse<EmployeeResponseDTO> getAllEmployees(String search, String department, EmploymentStatus status, Pageable pageable) {
        Query query = buildSearchFilterQuery(search, department, status);

        long totalElements = mongoTemplate.count(query, Employee.class);

        query.with(pageable);
        List<Employee> employees = mongoTemplate.find(query, Employee.class);

        List<EmployeeResponseDTO> dtos = employees.stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());

        Page<EmployeeResponseDTO> page = new PageImpl<>(dtos, pageable, totalElements);

        return PaginatedResponse.<EmployeeResponseDTO>builder()
                .content(page.getContent())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isLast(page.isLast())
                .isFirst(page.isFirst())
                .build();
    }

    @Override
    public List<EmployeeResponseDTO> getAllEmployeesForExport(String search, String department, EmploymentStatus status) {
        Query query = buildSearchFilterQuery(search, department, status);
        List<Employee> employees = mongoTemplate.find(query, Employee.class);
        return employees.stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getDistinctDepartments() {
        return mongoTemplate.query(Employee.class)
                .distinct("department")
                .as(String.class)
                .all();
    }

    @Override
    public Map<String, Long> getEmployeeStats() {
        long total = employeeRepository.count();
        long active = mongoTemplate.count(Query.query(Criteria.where("employmentStatus").is(EmploymentStatus.Active)), Employee.class);
        long inactive = total - active;

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("active", active);
        stats.put("inactive", inactive);
        return stats;
    }

    private Query buildSearchFilterQuery(String search, String department, EmploymentStatus status) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // Search across Name OR Email (case-insensitive regex)
        if (search != null && !search.trim().isEmpty()) {
            String trimmed = search.trim();
            Pattern pattern = Pattern.compile(Pattern.quote(trimmed), Pattern.CASE_INSENSITIVE);
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("fullName").regex(pattern),
                    Criteria.where("email").regex(pattern),
                    Criteria.where("employeeId").regex(pattern)
            ));
        }

        // Filter by Department
        if (department != null && !department.trim().isEmpty() && !department.equalsIgnoreCase("ALL")) {
            criteriaList.add(Criteria.where("department").is(department.trim()));
        }

        // Filter by Employment Status
        if (status != null) {
            criteriaList.add(Criteria.where("employmentStatus").is(status));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return query;
    }

    @Override
    public CsvImportResultDTO importEmployeesFromCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("CSV file cannot be empty");
        }

        int total = 0;
        int imported = 0;
        int updated = 0;
        int skipped = 0;
        List<String> errors = new java.util.ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;

                // Strip UTF-8 BOM if present on the very first line
                if (isFirstLine && line.startsWith("\uFEFF")) {
                    line = line.substring(1);
                }

                // Check and skip header row
                if (isFirstLine) {
                    isFirstLine = false;
                    String lower = line.toLowerCase();
                    if (lower.contains("employee id") || lower.contains("email") || lower.contains("name")) {
                        continue;
                    }
                }

                total++;
                List<String> tokens = parseCsvLine(line);

                if (tokens.size() < 3) {
                    skipped++;
                    errors.add("Row " + total + ": Insufficient columns (minimum Employee ID, Full Name, Email required)");
                    continue;
                }

                String empId = cleanField(tokens.get(0));
                String fullName = cleanField(tokens.get(1));
                String email = cleanField(tokens.get(2));

                if (empId.isEmpty() || fullName.isEmpty() || email.isEmpty()) {
                    skipped++;
                    errors.add("Row " + total + ": Missing mandatory field (Employee ID, Name, or Email)");
                    continue;
                }

                String phone = tokens.size() > 3 ? cleanField(tokens.get(3)) : "+91 9999999999";
                String dept = tokens.size() > 4 ? cleanField(tokens.get(4)) : "Engineering";
                String designation = tokens.size() > 5 ? cleanField(tokens.get(5)) : "Software Engineer";
                
                LocalDate doj = LocalDate.now();
                if (tokens.size() > 6) {
                    String dojStr = cleanField(tokens.get(6));
                    try {
                        doj = parseFlexibleDate(dojStr);
                    } catch (Exception e) {
                        doj = LocalDate.now();
                    }
                }

                Double salary = 800000.0;
                if (tokens.size() > 7) {
                    String salStr = cleanField(tokens.get(7)).replaceAll("[^0-9.]", "");
                    try {
                        if (!salStr.isEmpty()) salary = Double.parseDouble(salStr);
                    } catch (NumberFormatException ignored) {}
                }

                EmploymentStatus status = EmploymentStatus.Active;
                if (tokens.size() > 8) {
                    String statusStr = cleanField(tokens.get(8));
                    if ("inactive".equalsIgnoreCase(statusStr)) {
                        status = EmploymentStatus.Inactive;
                    }
                }

                try {
                    // Check if employee exists by employeeId or email
                    Optional<Employee> existingOpt = employeeRepository.findByEmployeeId(empId);
                    if (existingOpt.isEmpty()) {
                        existingOpt = employeeRepository.findByEmail(email);
                    }

                    if (existingOpt.isPresent()) {
                        Employee existing = existingOpt.get();
                        existing.setFullName(fullName);
                        existing.setEmail(email);
                        existing.setPhoneNumber(phone);
                        existing.setDepartment(dept);
                        existing.setDesignation(designation);
                        existing.setDateOfJoining(doj);
                        existing.setSalary(salary);
                        existing.setEmploymentStatus(status);
                        if (existing.getPassword() == null || existing.getPassword().isBlank()) {
                            existing.setPassword(passwordEncoder.encode("testing@123"));
                        }
                        if (existing.getRole() == null || existing.getRole().isBlank()) {
                            existing.setRole("ROLE_EMPLOYEE");
                        }
                        existing.setUpdatedAt(LocalDateTime.now());
                        employeeRepository.save(existing);
                        updated++;
                    } else {
                        Employee newEmp = Employee.builder()
                                .employeeId(empId)
                                .fullName(fullName)
                                .email(email)
                                .phoneNumber(phone)
                                .department(dept)
                                .designation(designation)
                                .dateOfJoining(doj)
                                .salary(salary)
                                .employmentStatus(status)
                                .role("ROLE_EMPLOYEE")
                                .password(passwordEncoder.encode("testing@123"))
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();
                        employeeRepository.save(newEmp);
                        imported++;
                    }
                } catch (Exception ex) {
                    skipped++;
                    errors.add("Row " + total + " (" + empId + "): " + ex.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("Failed to read CSV input stream", e);
            throw new RuntimeException("Error processing CSV file: " + e.getMessage());
        }

        log.info("CSV Import summary: total={}, imported={}, updated={}, skipped={}", total, imported, updated, skipped);
        return CsvImportResultDTO.builder()
                .totalRows(total)
                .importedCount(imported)
                .updatedCount(updated)
                .skippedCount(skipped)
                .errors(errors)
                .build();
    }

    private List<String> parseCsvLine(String line) {
        List<String> values = new java.util.ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                values.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        values.add(sb.toString().trim());
        return values;
    }

    private String cleanField(String val) {
        if (val == null) return "";
        String trimmed = val.trim();
        if (trimmed.startsWith("\"") && trimmed.endsWith("\"") && trimmed.length() >= 2) {
            trimmed = trimmed.substring(1, trimmed.length() - 1).replace("\"\"", "\"").trim();
        }
        if (trimmed.startsWith("'")) {
            trimmed = trimmed.substring(1).trim();
        }
        return trimmed;
    }

    private LocalDate parseFlexibleDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return LocalDate.now();
        dateStr = dateStr.trim();
        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ofPattern("yyyy-MM-dd"),
                DateTimeFormatter.ofPattern("dd-MM-yyyy"),
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                DateTimeFormatter.ofPattern("yyyy/MM/dd"),
                DateTimeFormatter.ofPattern("M/d/yyyy")
        );
        for (DateTimeFormatter fmt : formatters) {
            try {
                return LocalDate.parse(dateStr, fmt);
            } catch (Exception ignored) {}
        }
        return LocalDate.now();
    }

}
