package com.internship.tool.controller;

import com.internship.tool.entity.DataItem;
import com.internship.tool.service.DataItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data-items")
public class DataItemController {

    private final DataItemService service;

    public DataItemController(DataItemService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<DataItem> create(@Valid @RequestBody DataItem item) {
        return ResponseEntity.ok(service.create(item));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<DataItem>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<DataItem> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DataItem> update(@PathVariable Long id,
                                           @Valid @RequestBody DataItem item) {
        return ResponseEntity.ok(service.update(id, item));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}