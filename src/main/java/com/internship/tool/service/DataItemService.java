package com.internship.tool.service;

import com.internship.tool.entity.DataItem;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.DataItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataItemService {

    private final DataItemRepository repository;

    public DataItemService(DataItemRepository repository) {
        this.repository = repository;
    }

    public DataItem create(DataItem item) {
        return repository.save(item);
    }

    public List<DataItem> getAll() {
        return repository.findAll();
    }

    public DataItem getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data not found with id: " + id));
    }

    public DataItem update(Long id, DataItem item) {
        DataItem existing = getById(id);

        existing.setName(item.getName());
        existing.setDescription(item.getDescription());
        existing.setCategory(item.getCategory());

        return repository.save(existing);
    }

    public void delete(Long id) {
        DataItem existing = getById(id);
        repository.delete(existing);
    }

    public Page<DataItem> getAllWithPagination(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<DataItem> searchByName(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }
}