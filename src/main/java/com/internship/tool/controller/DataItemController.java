package com.internship.tool.controller;

import com.internship.tool.dto.DataItemRequest;
import com.internship.tool.dto.DataItemResponse;
import com.internship.tool.service.DataItemService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // 🔹 CREATE
    @PostMapping
    public ResponseEntity<DataItemResponse> create(@Valid @RequestBody DataItemRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    // 🔹 GET ALL
    @GetMapping
    public ResponseEntity<List<DataItemResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // 🔹 GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<DataItemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // 🔹 UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DataItemResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody DataItemRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // 🔹 PAGINATION
    @GetMapping("/page")
    public ResponseEntity<Page<DataItemResponse>> getAllWithPagination(Pageable pageable) {
        return ResponseEntity.ok(service.getAllWithPagination(pageable));
    }

    // 🔹 SEARCH
    @GetMapping("/search")
    public ResponseEntity<List<DataItemResponse>> search(@RequestParam String name) {
        return ResponseEntity.ok(service.searchByName(name));
    }
}