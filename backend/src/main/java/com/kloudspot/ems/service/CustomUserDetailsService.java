package com.kloudspot.ems.service;

import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public static final String DEFAULT_EMPLOYEE_PASSWORD = "testing@123";
    public static final String DEFAULT_ADMIN_PASSWORD = "samarthgunjal";

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username == null || username.trim().isEmpty()) {
            throw new UsernameNotFoundException("Username cannot be blank");
        }

        String trimmed = username.trim();

        // 1. HR Administrator Accounts (admin or samarth or EMP-1000)
        if ("admin".equalsIgnoreCase(trimmed) || "samarth".equalsIgnoreCase(trimmed)) {
            Optional<Employee> adminEmp = employeeRepository.findByEmailIgnoreCase("samarth@kloudspot.com");
            if (adminEmp.isEmpty()) {
                adminEmp = employeeRepository.findByEmployeeIdIgnoreCase("EMP-1000");
            }

            String adminPwd = adminEmp.map(Employee::getPassword)
                    .filter(p -> p != null && !p.isBlank())
                    .orElse(DEFAULT_ADMIN_PASSWORD);

            String encodedPwd = adminPwd.startsWith("$2a$") ? adminPwd : passwordEncoder.encode(adminPwd);

            return new User(
                    "admin",
                    encodedPwd,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // 2. Employee Lookup by ID or Email
        Optional<Employee> empOpt = employeeRepository.findByEmployeeIdIgnoreCase(trimmed);
        if (empOpt.isEmpty()) {
            empOpt = employeeRepository.findByEmailIgnoreCase(trimmed);
        }

        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            String rawPassword = (emp.getPassword() != null && !emp.getPassword().isBlank())
                    ? emp.getPassword()
                    : DEFAULT_EMPLOYEE_PASSWORD;

            String encodedPassword = rawPassword.startsWith("$2a$") ? rawPassword : passwordEncoder.encode(rawPassword);

            String role = (emp.getRole() != null && !emp.getRole().isBlank())
                    ? emp.getRole()
                    : "ROLE_EMPLOYEE";

            if ("ROLE_ADMIN".equalsIgnoreCase(role) || "EMP-1000".equalsIgnoreCase(emp.getEmployeeId())) {
                role = "ROLE_ADMIN";
            } else if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role.toUpperCase();
            }

            return new User(
                    emp.getEmployeeId(),
                    encodedPassword,
                    Collections.singletonList(new SimpleGrantedAuthority(role))
            );
        }

        throw new UsernameNotFoundException("No employee account found matching: " + trimmed);
    }
}
