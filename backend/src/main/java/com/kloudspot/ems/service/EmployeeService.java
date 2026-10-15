package com.kloudspot.ems.service;

import com.kloudspot.ems.dto.EmployeeRequestDTO;
import com.kloudspot.ems.dto.EmployeeResponseDTO;
import com.kloudspot.ems.dto.PaginatedResponse;
import com.kloudspot.ems.model.EmploymentStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface EmployeeService {
    EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO);
    EmployeeResponseDTO getEmployeeById(String id);
    EmployeeResponseDTO updateEmployee(String id, EmployeeRequestDTO requestDTO);
    void deleteEmployee(String id);
    PaginatedResponse<EmployeeResponseDTO> getAllEmployees(String search, String department, EmploymentStatus status, Pageable pageable);
    List<EmployeeResponseDTO> getAllEmployeesForExport(String search, String department, EmploymentStatus status);
    List<String> getDistinctDepartments();
    Map<String, Long> getEmployeeStats();
}
