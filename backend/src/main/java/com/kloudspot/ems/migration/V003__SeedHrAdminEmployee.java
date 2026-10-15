package com.kloudspot.ems.migration;

import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.repository.EmployeeRepository;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@ChangeUnit(id = "v003-seed-hr-admin-employee", order = "003", author = "samarth")
@RequiredArgsConstructor
@Slf4j
public class V003__SeedHrAdminEmployee {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Execution
    public void execution() {
        if (!employeeRepository.existsByEmployeeId("EMP-1000")) {
            Employee hrAdmin = Employee.builder()
                    .employeeId("EMP-1000")
                    .fullName("Samarth")
                    .email("samarth@kloudspot.com")
                    .phoneNumber("+91 9876543200")
                    .department("Human Resources")
                    .designation("Lead HR Administrator")
                    .dateOfJoining(LocalDate.of(2020, 1, 10))
                    .salary(1200000.0)
                    .employmentStatus(EmploymentStatus.Active)
                    .role("ROLE_ADMIN")
                    .password(passwordEncoder.encode("samarthgunjal"))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            employeeRepository.save(hrAdmin);
            log.info("[MONGOCK MIGRATION 003] Successfully registered HR Administrator 'Samarth' (EMP-1000) as an active employee in MongoDB.");
        }
    }

    @RollbackExecution
    public void rollback() {
        employeeRepository.deleteByEmployeeId("EMP-1000");
    }
}
