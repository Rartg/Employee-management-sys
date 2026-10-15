package com.kloudspot.ems.migration;

import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.repository.EmployeeRepository;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Mongock Migration 002: Seeds 12 realistic initial employee records across multiple departments.
 */
@Slf4j
@ChangeUnit(id = "v002-seed-initial-employees", order = "002", author = "samarth")
public class V002__SeedInitialEmployees {

    private final EmployeeRepository employeeRepository;

    public V002__SeedInitialEmployees(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Execution
    public void execution() {
        log.info("[MONGOCK MIGRATION 002] Starting data seeding of 12 employees...");

        if (employeeRepository.count() > 0) {
            log.info("[MONGOCK MIGRATION 002] Database already contains records. Skipping duplicate seeding.");
            return;
        }

        List<Employee> seedList = Arrays.asList(
                Employee.builder()
                        .employeeId("EMP-1001")
                        .fullName("Aarav Sharma")
                        .email("aarav.sharma@kloudspot.com")
                        .phoneNumber("+91 9876543210")
                        .department("Engineering")
                        .designation("Lead Backend Engineer")
                        .dateOfJoining(LocalDate.of(2022, 1, 10))
                        .salary(1200000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1002")
                        .fullName("Diya Patel")
                        .email("diya.patel@kloudspot.com")
                        .phoneNumber("+91 9876543211")
                        .department("Engineering")
                        .designation("Senior Full Stack Developer")
                        .dateOfJoining(LocalDate.of(2022, 5, 15))
                        .salary(950000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1003")
                        .fullName("Rohan Verma")
                        .email("rohan.verma@kloudspot.com")
                        .phoneNumber("+91 9876543212")
                        .department("Human Resources")
                        .designation("HR Business Partner")
                        .dateOfJoining(LocalDate.of(2021, 8, 1))
                        .salary(800000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1004")
                        .fullName("Ananya Iyer")
                        .email("ananya.iyer@kloudspot.com")
                        .phoneNumber("+91 9876543213")
                        .department("Marketing")
                        .designation("Digital Marketing Lead")
                        .dateOfJoining(LocalDate.of(2023, 2, 20))
                        .salary(850000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1005")
                        .fullName("Vikram Malhotra")
                        .email("vikram.m@kloudspot.com")
                        .phoneNumber("+91 9876543214")
                        .department("Finance")
                        .designation("Financial Analyst")
                        .dateOfJoining(LocalDate.of(2020, 11, 5))
                        .salary(900000.0)
                        .employmentStatus(EmploymentStatus.Inactive)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1006")
                        .fullName("Neha Kapoor")
                        .email("neha.kapoor@kloudspot.com")
                        .phoneNumber("+91 9876543215")
                        .department("Engineering")
                        .designation("DevOps Engineer")
                        .dateOfJoining(LocalDate.of(2023, 6, 12))
                        .salary(1050000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1007")
                        .fullName("Siddharth Rao")
                        .email("siddharth.rao@kloudspot.com")
                        .phoneNumber("+91 9876543216")
                        .department("Sales")
                        .designation("Enterprise Account Executive")
                        .dateOfJoining(LocalDate.of(2022, 9, 18))
                        .salary(1100000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1008")
                        .fullName("Pooja Nair")
                        .email("pooja.nair@kloudspot.com")
                        .phoneNumber("+91 9876543217")
                        .department("Human Resources")
                        .designation("Talent Acquisition Specialist")
                        .dateOfJoining(LocalDate.of(2023, 1, 15))
                        .salary(650000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1009")
                        .fullName("Karan Joshi")
                        .email("karan.joshi@kloudspot.com")
                        .phoneNumber("+91 9876543218")
                        .department("Engineering")
                        .designation("QA Automation Engineer")
                        .dateOfJoining(LocalDate.of(2022, 3, 22))
                        .salary(750000.0)
                        .employmentStatus(EmploymentStatus.Inactive)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1010")
                        .fullName("Meera Pillai")
                        .email("meera.pillai@kloudspot.com")
                        .phoneNumber("+91 9876543219")
                        .department("Operations")
                        .designation("Operations Manager")
                        .dateOfJoining(LocalDate.of(2019, 7, 10))
                        .salary(980000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1011")
                        .fullName("Aditya Roy")
                        .email("aditya.roy@kloudspot.com")
                        .phoneNumber("+91 9876543220")
                        .department("Marketing")
                        .designation("Content & Brand Strategist")
                        .dateOfJoining(LocalDate.of(2023, 8, 1))
                        .salary(720000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Employee.builder()
                        .employeeId("EMP-1012")
                        .fullName("Simran Kaur")
                        .email("simran.kaur@kloudspot.com")
                        .phoneNumber("+91 9876543221")
                        .department("Finance")
                        .designation("Senior Accountant")
                        .dateOfJoining(LocalDate.of(2021, 4, 18))
                        .salary(820000.0)
                        .employmentStatus(EmploymentStatus.Active)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        );

        employeeRepository.saveAll(seedList);
        log.info("[MONGOCK MIGRATION 002] Successfully seeded 12 employees via Mongock.");
    }

    @RollbackExecution
    public void rollback() {
        log.info("[MONGOCK ROLLBACK 002] Rolling back seeded employee data...");
        employeeRepository.deleteAll();
    }
}
