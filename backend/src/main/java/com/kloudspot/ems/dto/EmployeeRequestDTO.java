package com.kloudspot.ems.dto;

import com.kloudspot.ems.model.EmploymentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Payload for creating or updating an employee")
public class EmployeeRequestDTO {

    @NotBlank(message = "Employee ID is required")
    @Pattern(regexp = "^[A-Za-z0-9_-]{2,20}$", message = "Employee ID must be 2-20 alphanumeric characters (hyphens and underscores allowed)")
    @Schema(example = "EMP-101", description = "Unique employee identifier")
    private String employeeId;

    @NotBlank(message = "Full Name is required")
    @Size(min = 2, max = 100, message = "Full Name must be between 2 and 100 characters")
    @Schema(example = "Jane Doe", description = "Full name of the employee")
    private String fullName;

    @NotBlank(message = "Email Address is required")
    @Email(message = "Email must be a valid email address")
    @Schema(example = "jane.doe@kloudspot.com", description = "Unique employee email address")
    private String email;

    @NotBlank(message = "Phone Number is required")
    @Pattern(regexp = "^[+]?[0-9\\s-]{8,20}$", message = "Phone Number must be valid (8 to 20 digits, spaces or hyphens)")
    @Schema(example = "+91 9876543210", description = "Contact phone number")
    private String phoneNumber;

    @NotBlank(message = "Department is required")
    @Schema(example = "Engineering", description = "Department name")
    private String department;

    @NotBlank(message = "Designation is required")
    @Schema(example = "Backend Software Engineer", description = "Job title/role")
    private String designation;

    @NotNull(message = "Date of Joining is required")
    @PastOrPresent(message = "Date of Joining cannot be in the future")
    @Schema(example = "2024-03-15", description = "Date the employee joined the company")
    private LocalDate dateOfJoining;

    @NotNull(message = "Salary is required")
    @PositiveOrZero(message = "Salary must be zero or a positive amount")
    @Schema(example = "85000.00", description = "Annual salary")
    private Double salary;

    @NotNull(message = "Employment Status is required (Active or Inactive)")
    @Schema(example = "Active", description = "Current employment status (Active or Inactive)")
    private EmploymentStatus employmentStatus;
}
