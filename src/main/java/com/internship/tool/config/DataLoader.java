package com.internship.tool.config;

import com.internship.tool.entity.DataItem;
import com.internship.tool.repository.DataItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(DataItemRepository repository) {
        return args -> {

            if (repository.count() == 0) {

                for (int i = 1; i <= 30; i++) {
                    DataItem item = new DataItem();
                    item.setName("Sample Item " + i);
                    item.setDescription("This is sample data item " + i);

                    // 🔥 FIX (IMPORTANT)
                    item.setCategory("General");

                    repository.save(item);
                }

                System.out.println("✅ 30 sample records inserted");
            }
        };
    }
}