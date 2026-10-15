package com.kloudspot.ems.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.kloudspot.ems.dto.EmployeeRequestDTO;
import com.kloudspot.ems.dto.EmployeeResponseDTO;
import com.kloudspot.ems.dto.PaginatedResponse;
import com.kloudspot.ems.exception.DuplicateResourceException;
import com.kloudspot.ems.exception.GlobalExceptionHandler;
import com.kloudspot.ems.exception.ResourceNotFoundException;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import com.kloudspot.ems.dto.CsvImportResultDTO;
import org.springframework.mock.web.MockMultipartFile;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Employee Controller HTTP Layer Integration Tests")
class EmployeeControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    private EmployeeResponseDTO sampleResponse;
    private EmployeeRequestDTO sampleRequest;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        mockMvc = MockMvcBuilders.standaloneSetup(employeeController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        sampleResponse = EmployeeResponseDTO.builder()
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

        sampleRequest = EmployeeRequestDTO.builder()
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
    @DisplayName("GET /api/employees - Should return 200 OK with paginated envelope")
    void getAllEmployees_Returns200WithPagination() throws Exception {
        PaginatedResponse<EmployeeResponseDTO> paginatedResponse = PaginatedResponse.<EmployeeResponseDTO>builder()
                .content(List.of(sampleResponse))
                .pageNumber(0)
                .pageSize(10)
                .totalElements(1L)
                .totalPages(1)
                .isFirst(true)
                .isLast(true)
                .build();

        when(employeeService.getAllEmployees(any(), any(), any(), any(Pageable.class)))
                .thenReturn(paginatedResponse);

        mockMvc.perform(get("/api/employees")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].employeeId").value("EMP-101"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    @DisplayName("POST /api/employees - Should return 201 Created when payload is valid")
    void createEmployee_ValidPayload_Returns201() throws Exception {
        when(employeeService.createEmployee(any(EmployeeRequestDTO.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.employeeId").value("EMP-101"))
                .andExpect(jsonPath("$.data.fullName").value("Alice Johnson"));
    }

    @Test
    @DisplayName("POST /api/employees - Should return 400 Bad Request on validation errors")
    void createEmployee_MissingRequiredFields_Returns400() throws Exception {
        EmployeeRequestDTO invalidRequest = new EmployeeRequestDTO(); // All fields null/empty

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.validationErrors.employeeId").exists())
                .andExpect(jsonPath("$.validationErrors.fullName").exists())
                .andExpect(jsonPath("$.validationErrors.email").exists());
    }

    @Test
    @DisplayName("POST /api/employees - Should return 400 Bad Request on missing/empty request body")
    void createEmployee_EmptyBody_Returns400() throws Exception {
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Malformed Request"));
    }

    @Test
    @DisplayName("POST /api/employees - Should return 409 Conflict when employee ID or email already exists")
    void createEmployee_DuplicateConflict_Returns409() throws Exception {
        when(employeeService.createEmployee(any(EmployeeRequestDTO.class)))
                .thenThrow(new DuplicateResourceException("Employee with ID 'EMP-101' already exists"));

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value(containsString("already exists")));
    }

    @Test
    @DisplayName("GET /api/employees/{id} - Should return 404 Not Found when ID does not exist")
    void getEmployeeById_NotFound_Returns404() throws Exception {
        when(employeeService.getEmployeeById("non-existent-id"))
                .thenThrow(new ResourceNotFoundException("Employee with ID 'non-existent-id' not found"));

        mockMvc.perform(get("/api/employees/non-existent-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(containsString("not found")));
    }

    @Test
    @DisplayName("DELETE /api/employees/{id} - Should return 200 OK with standard ApiResponse envelope")
    void deleteEmployee_Returns200WithEnvelope() throws Exception {
        doNothing().when(employeeService).deleteEmployee("db-id-001");

        mockMvc.perform(delete("/api/employees/db-id-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Employee deleted successfully"));
    }

    @Test
    @DisplayName("GET /api/employees/export/csv - Should stream text/csv with attachment header")
    void exportToCsv_ReturnsCsvFile() throws Exception {
        when(employeeService.getAllEmployeesForExport(any(), any(), any()))
                .thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/employees/export/csv"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", containsString("text/csv")))
                .andExpect(header().string("Content-Disposition", containsString("employees_export.csv")))
                .andExpect(content().string(containsString("Employee ID,Full Name,Email")))
                .andExpect(content().string(containsString("EMP-101")));
    }

    @Test
    @DisplayName("POST /api/employees/import/csv - Should successfully import CSV records")
    void importEmployeesFromCsv_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test_employees.csv",
                "text/csv",
                "Employee ID,Full Name,Email\nEMP-999,Jane Doe,jane.d@kloudspot.com".getBytes()
        );

        CsvImportResultDTO result = CsvImportResultDTO.builder()
                .totalRows(1)
                .importedCount(1)
                .updatedCount(0)
                .skippedCount(0)
                .errors(List.of())
                .build();

        when(employeeService.importEmployeesFromCsv(any())).thenReturn(result);

        mockMvc.perform(multipart("/api/employees/import/csv").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.importedCount").value(1))
                .andExpect(jsonPath("$.data.totalRows").value(1));
    }

}
