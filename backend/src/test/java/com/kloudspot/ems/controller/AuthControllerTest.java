package com.kloudspot.ems.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kloudspot.ems.dto.LoginRequestDTO;
import com.kloudspot.ems.exception.GlobalExceptionHandler;
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
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("Authentication Controller Integration Tests")
class AuthControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/auth/login - Should successfully authenticate HR Administrator")
    void login_AdminSuccess() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("admin", "samarthgunjal");

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("admin");
        when(mockAuth.getAuthorities()).thenReturn(
                (java.util.Collection) Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("admin"))
                .andExpect(jsonPath("$.data.role").value("ROLE_ADMIN"))
                .andExpect(jsonPath("$.data.basicAuthHeader").exists());
    }

    @Test
    @DisplayName("POST /api/auth/login - Should successfully authenticate Employee with employeeId")
    void login_EmployeeSuccess() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("EMP-1002", "testing@123");

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("EMP-1002");
        when(mockAuth.getAuthorities()).thenReturn(
                (java.util.Collection) Collections.singletonList(new SimpleGrantedAuthority("ROLE_EMPLOYEE"))
        );
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);

        Employee emp = Employee.builder()
                .employeeId("EMP-1002")
                .fullName("Diya Patel")
                .email("diya.patel@kloudspot.com")
                .department("Engineering")
                .designation("Senior Full Stack Developer")
                .employmentStatus(EmploymentStatus.Active)
                .dateOfJoining(LocalDate.of(2022, 5, 15))
                .build();
        when(employeeRepository.findByEmployeeIdIgnoreCase("EMP-1002")).thenReturn(Optional.of(emp));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("EMP-1002"))
                .andExpect(jsonPath("$.data.fullName").value("Diya Patel"))
                .andExpect(jsonPath("$.data.role").value("ROLE_EMPLOYEE"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Should return 401 Unauthorized on invalid password")
    void login_InvalidCredentials_Returns401() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("admin", "wrong-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("Invalid username")));
    }

    @Test
    @DisplayName("POST /api/auth/logout - Should clear session and return 200 OK")
    void logout_Returns200() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }
}
