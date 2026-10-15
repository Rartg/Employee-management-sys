package com.kloudspot.ems.migration;

import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.repository.EmployeeRepository;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@ChangeUnit(id = "v004-set-default-user-passwords", order = "004", author = "samarth")
@RequiredArgsConstructor
@Slf4j
public class V004__SetDefaultUserPasswords {

    private final EmployeeRepository employeeRepository;

    @Execution
    public void execution() {
        log.info("[MONGOCK MIGRATION 004] Setting default passwords: 'samarthgunjal' for HR Admin and 'testing@123' for employees...");

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String defaultEmpHash = encoder.encode("testing@123");
        String adminHash = encoder.encode("samarthgunjal");

        List<Employee> allEmployees = employeeRepository.findAll();
        for (Employee emp : allEmployees) {
            if ("EMP-1000".equalsIgnoreCase(emp.getEmployeeId()) || "samarth@kloudspot.com".equalsIgnoreCase(emp.getEmail())) {
                emp.setPassword(adminHash);
                emp.setRole("ROLE_ADMIN");
            } else {
                emp.setPassword(defaultEmpHash);
                if (emp.getRole() == null || emp.getRole().isBlank()) {
                    emp.setRole("ROLE_EMPLOYEE");
                }
            }
        }
        employeeRepository.saveAll(allEmployees);
        log.info("[MONGOCK MIGRATION 004] Successfully set default passwords for {} employee records.", allEmployees.size());
    }

    @RollbackExecution
    public void rollback() {
        // No-op rollback
    }
}
