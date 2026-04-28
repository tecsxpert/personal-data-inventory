package com.internship.tool.service;

import com.internship.tool.dto.DataItemRequest;
import com.internship.tool.dto.DataItemResponse;
import com.internship.tool.entity.DataItem;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.DataItemRepository;
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

    // CREATE
    public DataItemResponse create(DataItemRequest request) {
        DataItem item = new DataItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());

        return mapToResponse(repository.save(item));
    }

    // GET ALL
    public List<DataItemResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public DataItemResponse getById(Long id) {
        DataItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data not found with id: " + id));

        return mapToResponse(item);
    }

    // UPDATE
    public DataItemResponse update(Long id, DataItemRequest request) {
        DataItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data not found with id: " + id));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());

        return mapToResponse(repository.save(item));
    }

    // DELETE
    public void delete(Long id) {
        DataItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data not found with id: " + id));

        repository.delete(item);
    }

    // PAGINATION
    public Page<DataItemResponse> getAllWithPagination(Pageable pageable) {
        return repository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // SEARCH
    public List<DataItemResponse> searchByName(String name) {
        return repository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // MAPPER
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