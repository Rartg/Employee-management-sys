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
import org.springframework.stereotype.Service;

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

    @Override
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO) {
        log.info("Creating new employee with employeeId: {}, email: {}", requestDTO.getEmployeeId(), requestDTO.getEmail());

        if (employeeRepository.existsByEmployeeId(requestDTO.getEmployeeId())) {
            throw new DuplicateResourceException("Employee with ID '" + requestDTO.getEmployeeId() + "' already exists");
        }
        if (employeeRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateResourceException("Employee with email '" + requestDTO.getEmail() + "' already exists");
        }

        Employee employee = Employee.builder()
                .employeeId(requestDTO.getEmployeeId().trim().toUpperCase())
                .fullName(requestDTO.getFullName().trim())
                .email(requestDTO.getEmail().trim().toLowerCase())
                .phoneNumber(requestDTO.getPhoneNumber().trim())
                .department(requestDTO.getDepartment().trim())
                .designation(requestDTO.getDesignation().trim())
                .dateOfJoining(requestDTO.getDateOfJoining())
                .salary(requestDTO.getSalary())
                .employmentStatus(requestDTO.getEmploymentStatus())
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
}
