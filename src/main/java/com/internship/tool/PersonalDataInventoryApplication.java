package com.internship.tool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
@EnableJpaAuditing   // 🔥 VERY IMPORTANT (for createdAt & updatedAt)
public class PersonalDataInventoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(PersonalDataInventoryApplication.class, args);
    }
}