package com.kloudspot.ems.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI employeeManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Kloudspot Employee Management System API")
                        .description("Enterprise RESTful API supporting Employee CRUD operations, search, filters, pagination, CSV import/export, and Spring Security Basic Authentication.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Samarth - Kloudspot Candidate")
                                .email("samarth@kloudspot.com"))
                        .license(new License().name("Apache 2.0")))
                .addSecurityItem(new SecurityRequirement().addList("BasicAuth"))
                .components(new Components().addSecuritySchemes("BasicAuth",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("basic")
                                .description("HTTP Basic Authentication. Admin: admin / admin123. All Employees: <EmployeeID> (e.g. EMP-1002) / kloudspot123")));
    }
}
