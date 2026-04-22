package com.internship.tool.service;

import com.internship.tool.entity.DataItem;
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
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public DataItem update(Long id, DataItem item) {
        DataItem existing = repository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(item.getName());
            existing.setDescription(item.getDescription());
            existing.setCategory(item.getCategory());
            return repository.save(existing);
        }
        return null;
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }
}