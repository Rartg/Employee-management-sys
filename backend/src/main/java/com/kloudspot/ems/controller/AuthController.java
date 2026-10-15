package com.kloudspot.ems.controller;

import com.kloudspot.ems.dto.ApiResponse;
import com.kloudspot.ems.dto.AuthResponseDTO;
import com.kloudspot.ems.dto.LoginRequestDTO;
import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.repository.EmployeeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Endpoints for employee & administrator login, session management and logout")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/login")
    @Operation(summary = "User Login with Spring Security Session",
            description = "Authenticates an administrator or any employee with designated password. Establishes a server-side HTTP session and returns profile data.")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername().trim(), request.getPassword())
            );

            // Establish Spring Security Context in HTTP Session
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            if (httpRequest != null) {
                HttpSession session = httpRequest.getSession(true);
                session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
            }

            String username = authentication.getName();
            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_EMPLOYEE");

            // Build Basic Auth header value for dual compatibility
            String rawCredentials = request.getUsername().trim() + ":" + request.getPassword();
            String basicAuthHeader = "Basic " + Base64.getEncoder().encodeToString(rawCredentials.getBytes(StandardCharsets.UTF_8));

            AuthResponseDTO.AuthResponseDTOBuilder responseBuilder = AuthResponseDTO.builder()
                    .basicAuthHeader(basicAuthHeader)
                    .username(username)
                    .role(role);

            // Lookup profile in MongoDB
            Optional<Employee> empOpt = employeeRepository.findByEmployeeIdIgnoreCase(username);
            if (empOpt.isEmpty()) {
                empOpt = employeeRepository.findByEmailIgnoreCase(username);
            }
            if (empOpt.isEmpty() && ("admin".equalsIgnoreCase(username) || "samarth".equalsIgnoreCase(username))) {
                empOpt = employeeRepository.findByEmployeeIdIgnoreCase("EMP-1000");
            }

            if (empOpt.isPresent()) {
                Employee emp = empOpt.get();
                responseBuilder.fullName(emp.getFullName())
                        .email(emp.getEmail())
                        .department(emp.getDepartment())
                        .designation(emp.getDesignation())
                        .employeeId(emp.getEmployeeId());
            } else if ("ROLE_ADMIN".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(username)) {
                responseBuilder.fullName("Samarth")
                        .email("samarth@kloudspot.com")
                        .department("Human Resources")
                        .designation("Lead HR Administrator")
                        .employeeId("EMP-1000");
            } else {
                responseBuilder.fullName(username)
                        .employeeId(username);
            }

            log.info("User '{}' authenticated successfully with role '{}' (session established)", username, role);
            return ResponseEntity.ok(ApiResponse.success("Authentication successful", responseBuilder.build()));

        } catch (BadCredentialsException ex) {
            log.warn("Failed authentication attempt for identifier: '{}'", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<AuthResponseDTO>builder()
                            .success(false)
                            .message("Invalid username, employee ID, email, or password")
                            .build());
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile", description = "Returns details of the currently authenticated principal from SecurityContext.")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<AuthResponseDTO>builder()
                            .success(false)
                            .message("No active authentication session")
                            .build());
        }

        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_EMPLOYEE");

        AuthResponseDTO.AuthResponseDTOBuilder responseBuilder = AuthResponseDTO.builder()
                .username(username)
                .role(role);

        Optional<Employee> empOpt = employeeRepository.findByEmployeeIdIgnoreCase(username);
        if (empOpt.isEmpty()) {
            empOpt = employeeRepository.findByEmailIgnoreCase(username);
        }
        if (empOpt.isEmpty() && ("admin".equalsIgnoreCase(username) || "samarth".equalsIgnoreCase(username))) {
            empOpt = employeeRepository.findByEmployeeIdIgnoreCase("EMP-1000");
        }

        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            responseBuilder.fullName(emp.getFullName())
                    .email(emp.getEmail())
                    .department(emp.getDepartment())
                    .designation(emp.getDesignation())
                    .employeeId(emp.getEmployeeId());
        } else {
            responseBuilder.fullName(username)
                    .employeeId(username);
        }

        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved", responseBuilder.build()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out current user", description = "Clears the active Spring Security context and invalidates session.")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest httpRequest) {
        SecurityContextHolder.clearContext();
        if (httpRequest != null) {
            HttpSession session = httpRequest.getSession(false);
            if (session != null) {
                session.invalidate();
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
}
