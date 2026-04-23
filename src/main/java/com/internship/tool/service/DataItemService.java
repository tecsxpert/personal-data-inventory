package com.internship.tool.service;

import com.internship.tool.entity.DataItem;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.DataItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataItemService {

    private final DataItemRepository repository;

    public DataItemService(DataItemRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public DataItem create(DataItem item) {
        return repository.save(item);
    }

    // GET ALL
    public List<DataItem> getAll() {
        return repository.findAll();
    }

    // GET BY ID
    public DataItem getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Data not found with id: " + id));
    }

    // UPDATE
    public DataItem update(Long id, DataItem item) {
        DataItem existing = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Data not found with id: " + id));

        existing.setName(item.getName());
        existing.setDescription(item.getDescription());
        existing.setCategory(item.getCategory());

        return repository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        DataItem existing = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Data not found with id: " + id));

        repository.delete(existing);
    }
}