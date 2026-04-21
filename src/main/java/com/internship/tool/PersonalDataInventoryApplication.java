package com.internship.tool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = "com.internship.tool")
@EntityScan(basePackages = "com.internship.tool.entity")
@EnableJpaAuditing
public class PersonalDataInventoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(PersonalDataInventoryApplication.class, args);
    }
}