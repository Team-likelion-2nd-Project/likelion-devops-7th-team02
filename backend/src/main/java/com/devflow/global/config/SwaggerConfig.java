package com.devflow.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI devflowOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("DevFlow API")
                        .description("DevFlow Backend API Documentation")
                        .version("v1"));
    }
}