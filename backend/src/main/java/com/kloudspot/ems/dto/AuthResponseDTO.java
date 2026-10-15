package com.kloudspot.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response payload containing user profile and basic auth header")
public class AuthResponseDTO {

    @Schema(description = "Base64 encoded HTTP Basic Auth header value (for subsequent API calls)", example = "Basic QWRtaW46YWRtaW4xMjM=")
    private String basicAuthHeader;

    @Schema(description = "Identifier or username used for session", example = "EMP-1002")
    private String username;

    @Schema(description = "Employee full name", example = "Diya Patel")
    private String fullName;

    @Schema(description = "Employee email address", example = "diya.patel@kloudspot.com")
    private String email;

    @Schema(description = "Granted security role", example = "ROLE_EMPLOYEE")
    private String role;

    @Schema(description = "Department name", example = "Engineering")
    private String department;

    @Schema(description = "Designation title", example = "Senior Full Stack Developer")
    private String designation;

    @Schema(description = "Unique Kloudspot employee identifier", example = "EMP-1002")
    private String employeeId;
}
