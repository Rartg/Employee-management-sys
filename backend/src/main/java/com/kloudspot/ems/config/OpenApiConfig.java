package com.kloudspot.ems.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI employeeManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Kloudspot Employee Management System API")
                        .description("RESTful API service supporting comprehensive Employee Management operations, filtering, search, pagination, and data export.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Kloudspot Assessment Team")
                                .email("hr.team@kloudspot.com"))
                        .license(new License().name("Apache 2.0")));
    }
}
