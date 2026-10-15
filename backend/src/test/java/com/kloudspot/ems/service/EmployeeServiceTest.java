package com.kloudspot.ems.service;

import com.kloudspot.ems.dto.EmployeeRequestDTO;
import com.kloudspot.ems.dto.EmployeeResponseDTO;
import com.kloudspot.ems.dto.PaginatedResponse;
import com.kloudspot.ems.exception.DuplicateResourceException;
import com.kloudspot.ems.exception.ResourceNotFoundException;
import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Employee Service Business Logic Unit Tests")
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee sampleEmployee;
    private EmployeeRequestDTO sampleRequestDTO;

    @BeforeEach
    void setUp() {
        lenient().when(passwordEncoder.encode(anyString())).thenAnswer(invocation -> "encoded_" + invocation.getArgument(0));

        sampleEmployee = Employee.builder()
                .id("db-id-001")
                .employeeId("EMP-101")
                .fullName("Alice Johnson")
                .email("alice.j@kloudspot.com")
                .phoneNumber("+91 9988776655")
                .department("Engineering")
                .designation("Backend Developer")
                .dateOfJoining(LocalDate.of(2023, 1, 15))
                .salary(80000.0)
                .employmentStatus(EmploymentStatus.Active)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sampleRequestDTO = EmployeeRequestDTO.builder()
                .employeeId("EMP-101")
                .fullName("Alice Johnson")
                .email("alice.j@kloudspot.com")
                .phoneNumber("+91 9988776655")
                .department("Engineering")
                .designation("Backend Developer")
                .dateOfJoining(LocalDate.of(2023, 1, 15))
                .salary(80000.0)
                .employmentStatus(EmploymentStatus.Active)
                .build();
    }

    @Test
    @DisplayName("Should successfully create a new employee when valid data is provided")
    void createEmployee_Success() {
        when(employeeRepository.existsByEmployeeId("EMP-101")).thenReturn(false);
        when(employeeRepository.existsByEmail("alice.j@kloudspot.com")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(sampleEmployee);

        EmployeeResponseDTO result = employeeService.createEmployee(sampleRequestDTO);

        assertNotNull(result);
        assertEquals("EMP-101", result.getEmployeeId());
        assertEquals("alice.j@kloudspot.com", result.getEmail());
        assertEquals(EmploymentStatus.Active, result.getEmploymentStatus());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when employeeId already exists")
    void createEmployee_DuplicateEmployeeId_ThrowsException() {
        when(employeeRepository.existsByEmployeeId("EMP-101")).thenReturn(true);

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class,
                () -> employeeService.createEmployee(sampleRequestDTO));

        assertTrue(exception.getMessage().contains("already exists"));
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email already exists")
    void createEmployee_DuplicateEmail_ThrowsException() {
        when(employeeRepository.existsByEmployeeId("EMP-101")).thenReturn(false);
        when(employeeRepository.existsByEmail("alice.j@kloudspot.com")).thenReturn(true);

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class,
                () -> employeeService.createEmployee(sampleRequestDTO));

        assertTrue(exception.getMessage().contains("already exists"));
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should return employee details when ID exists")
    void getEmployeeById_Success() {
        when(employeeRepository.findById("db-id-001")).thenReturn(Optional.of(sampleEmployee));

        EmployeeResponseDTO result = employeeService.getEmployeeById("db-id-001");

        assertNotNull(result);
        assertEquals("db-id-001", result.getId());
        assertEquals("Alice Johnson", result.getFullName());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when ID does not exist")
    void getEmployeeById_NotFound_ThrowsException() {
        when(employeeRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> employeeService.getEmployeeById("non-existent-id"));

        assertTrue(exception.getMessage().contains("not found"));
    }

    @Test
    @DisplayName("Should successfully update employee details")
    void updateEmployee_Success() {
        when(employeeRepository.findById("db-id-001")).thenReturn(Optional.of(sampleEmployee));
        when(employeeRepository.existsByEmployeeIdAndIdNot(anyString(), anyString())).thenReturn(false);
        when(employeeRepository.existsByEmailAndIdNot(anyString(), anyString())).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(sampleEmployee);

        sampleRequestDTO.setSalary(95000.0);
        EmployeeResponseDTO result = employeeService.updateEmployee("db-id-001", sampleRequestDTO);

        assertNotNull(result);
        verify(employeeRepository, times(1)).save(sampleEmployee);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating non-existent employee")
    void updateEmployee_NotFound_ThrowsException() {
        when(employeeRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> employeeService.updateEmployee("non-existent-id", sampleRequestDTO));

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should successfully delete employee when ID exists")
    void deleteEmployee_Success() {
        when(employeeRepository.existsById("db-id-001")).thenReturn(true);
        doNothing().when(employeeRepository).deleteById("db-id-001");

        assertDoesNotThrow(() -> employeeService.deleteEmployee("db-id-001"));
        verify(employeeRepository, times(1)).deleteById("db-id-001");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent ID")
    void deleteEmployee_NotFound_ThrowsException() {
        when(employeeRepository.existsById("non-existent-id")).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
                () -> employeeService.deleteEmployee("non-existent-id"));

        verify(employeeRepository, never()).deleteById(anyString());
    }

    @Test
    @DisplayName("Should return paginated employee list with total count")
    void getAllEmployees_WithPagination() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(Employee.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(Employee.class))).thenReturn(List.of(sampleEmployee));

        PaginatedResponse<EmployeeResponseDTO> response =
                employeeService.getAllEmployees(null, null, null, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(1L, response.getTotalElements());
        assertEquals(0, response.getPageNumber());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when updating with an employeeId already taken by another employee")
    void updateEmployee_DuplicateEmployeeId_ThrowsException() {
        when(employeeRepository.findById("db-id-001")).thenReturn(Optional.of(sampleEmployee));
        when(employeeRepository.existsByEmployeeIdAndIdNot(eq("EMP-101"), eq("db-id-001"))).thenReturn(true);

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class,
                () -> employeeService.updateEmployee("db-id-001", sampleRequestDTO));

        assertTrue(exception.getMessage().contains("already assigned"));
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when updating with an email already taken by another employee")
    void updateEmployee_DuplicateEmail_ThrowsException() {
        when(employeeRepository.findById("db-id-001")).thenReturn(Optional.of(sampleEmployee));
        when(employeeRepository.existsByEmployeeIdAndIdNot(anyString(), anyString())).thenReturn(false);
        when(employeeRepository.existsByEmailAndIdNot(eq("alice.j@kloudspot.com"), eq("db-id-001"))).thenReturn(true);

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class,
                () -> employeeService.updateEmployee("db-id-001", sampleRequestDTO));

        assertTrue(exception.getMessage().contains("already assigned"));
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should apply search query and department/status filter in query criteria")
    void getAllEmployees_WithSearchAndFilter() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(Employee.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(Employee.class))).thenReturn(List.of(sampleEmployee));

        PaginatedResponse<EmployeeResponseDTO> response =
                employeeService.getAllEmployees("Alice", "Engineering", EmploymentStatus.Active, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        verify(mongoTemplate, times(1)).count(any(Query.class), eq(Employee.class));
        verify(mongoTemplate, times(1)).find(any(Query.class), eq(Employee.class));
    }

    @Test
    @DisplayName("Should retrieve all matching employees for CSV export")
    void getAllEmployeesForExport_Success() {
        when(mongoTemplate.find(any(Query.class), eq(Employee.class))).thenReturn(List.of(sampleEmployee));

        List<EmployeeResponseDTO> result = employeeService.getAllEmployeesForExport("Alice", "Engineering", EmploymentStatus.Active);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("EMP-101", result.get(0).getEmployeeId());
    }

    @Test
    @DisplayName("Should calculate employee KPI statistics accurately")
    void getEmployeeStats_Success() {
        when(employeeRepository.count()).thenReturn(12L);
        when(mongoTemplate.count(any(Query.class), eq(Employee.class))).thenReturn(10L);

        Map<String, Long> stats = employeeService.getEmployeeStats();

        assertNotNull(stats);
        assertEquals(12L, stats.get("total"));
        assertEquals(10L, stats.get("active"));
        assertEquals(2L, stats.get("inactive"));
    }
}
