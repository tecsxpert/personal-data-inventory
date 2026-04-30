package com.internship.tool.service;

import com.internship.tool.dto.DataItemRequest;
import com.internship.tool.dto.DataItemResponse;
import com.internship.tool.entity.DataItem;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.DataItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataItemService {

    private static final Logger logger = LoggerFactory.getLogger(DataItemService.class);

    private final DataItemRepository repository;
    private final EmailService emailService;

    // ✅ CONSTRUCTOR
    public DataItemService(DataItemRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    // 🔹 CREATE
    @CacheEvict(value = "dataItems", allEntries = true)
    public DataItemResponse create(DataItemRequest request) {

        logger.info("Creating new data item: {}", request.getName());

        DataItem item = new DataItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());

        DataItem savedItem = repository.save(item);

        logger.info("Data item created with ID: {}", savedItem.getId());

        // 🔥 EMAIL (THYMELEAF BASED — DAY 7 FINAL)
        try {
            emailService.sendEmail(
                    "yashashjhj@gmail.com",
                    "Data Item Created",
                    "A new data item has been created",
                    savedItem.getName()
            );

            logger.info("Email sent successfully for item: {}", savedItem.getName());

        } catch (Exception e) {
            logger.error("Failed to send email: {}", e.getMessage());
        }

        return mapToResponse(savedItem);
    }

    // 🔹 GET ALL (CACHED)
    @Cacheable("dataItems")
    public List<DataItemResponse> getAll() {
        logger.info("Fetching all data items from DB");

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 🔹 GET BY ID (CACHED)
    @Cacheable(value = "dataItems", key = "#id")
    public DataItemResponse getById(Long id) {

        logger.info("Fetching data item by ID: {}", id);

        DataItem item = repository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Data item not found with ID: {}", id);
                    return new ResourceNotFoundException("Data not found with id: " + id);
                });

        return mapToResponse(item);
    }

    // 🔹 UPDATE
    @CacheEvict(value = "dataItems", allEntries = true)
    public DataItemResponse update(Long id, DataItemRequest request) {

        logger.info("Updating data item with ID: {}", id);

        DataItem item = repository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Data item not found for update with ID: {}", id);
                    return new ResourceNotFoundException("Data not found with id: " + id);
                });

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());

        DataItem updatedItem = repository.save(item);

        logger.info("Data item updated with ID: {}", updatedItem.getId());

        return mapToResponse(updatedItem);
    }

    // 🔹 DELETE
    @CacheEvict(value = "dataItems", allEntries = true)
    public void delete(Long id) {

        logger.info("Deleting data item with ID: {}", id);

        DataItem item = repository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Data item not found for deletion with ID: {}", id);
                    return new ResourceNotFoundException("Data not found with id: " + id);
                });

        repository.delete(item);

        logger.info("Data item deleted with ID: {}", id);
    }

    // 🔹 PAGINATION
    public Page<DataItemResponse> getAllWithPagination(Pageable pageable) {

        logger.info("Fetching data items with pagination");

        return repository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // 🔹 SEARCH
    public List<DataItemResponse> searchByName(String name) {

        logger.info("Searching data items with name: {}", name);

        return repository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 🔹 MAPPER
    private DataItemResponse mapToResponse(DataItem item) {
        return new DataItemResponse(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getCategory(),
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }
}