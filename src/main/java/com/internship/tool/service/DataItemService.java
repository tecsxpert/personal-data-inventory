package com.internship.tool.service;

import com.internship.tool.dto.DataItemRequest;
import com.internship.tool.dto.DataItemResponse;
import com.internship.tool.entity.DataItem;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.DataItemRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataItemService {

    private final DataItemRepository repository;

    public DataItemService(DataItemRepository repository) {
        this.repository = repository;
    }

    // 🔹 CREATE
    @CacheEvict(value = "dataItems", allEntries = true)
    public DataItemResponse create(DataItemRequest request) {
        DataItem item = new DataItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());

        return mapToResponse(repository.save(item));
    }

    // 🔹 GET ALL (CACHED)
    @Cacheable("dataItems")
    public List<DataItemResponse> getAll() {

        System.out.println("🔥 Fetching from DB...");

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 🔹 GET BY ID (CACHED)
    @Cacheable(value = "dataItems", key = "#id")
    public DataItemResponse getById(Long id) {
        DataItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data not found with id: " + id));

        return mapToResponse(item);
    }

    // 🔹 UPDATE
    @CacheEvict(value = "dataItems", allEntries = true)
    public DataItemResponse update(Long id, DataItemRequest request) {
        DataItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data not found with id: " + id));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());

        return mapToResponse(repository.save(item));
    }

    // 🔹 DELETE
    @CacheEvict(value = "dataItems", allEntries = true)
    public void delete(Long id) {
        DataItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data not found with id: " + id));

        repository.delete(item);
    }

    // 🔹 PAGINATION
    public Page<DataItemResponse> getAllWithPagination(Pageable pageable) {
        return repository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // 🔹 SEARCH
    public List<DataItemResponse> searchByName(String name) {
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