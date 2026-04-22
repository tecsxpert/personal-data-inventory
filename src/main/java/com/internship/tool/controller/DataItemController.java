package com.internship.tool.controller;

import com.internship.tool.entity.DataItem;
import com.internship.tool.service.DataItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data-items")
public class DataItemController {

    private final DataItemService service;

    public DataItemController(DataItemService service) {
        this.service = service;
    }

    @PostMapping
    public DataItem create(@RequestBody DataItem item) {
        return service.create(item);
    }

    @GetMapping
    public List<DataItem> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public DataItem getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public DataItem update(@PathVariable Long id, @RequestBody DataItem item) {
        return service.update(id, item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}