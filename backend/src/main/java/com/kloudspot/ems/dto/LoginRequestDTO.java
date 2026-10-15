package com.kloudspot.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication login request payload")
public class LoginRequestDTO {

    @NotBlank(message = "Username, Employee ID or Email is required")
    @Schema(description = "Employee ID (e.g. EMP-1002), Corporate Email, or admin", example = "EMP-1002")
    private String username;

    @NotBlank(message = "Password is required")
    @Schema(description = "User corporate password (default: kloudspot123 or admin123)", example = "kloudspot123")
    private String password;
}
