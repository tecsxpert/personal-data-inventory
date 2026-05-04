package com.internship.tool.controller;

import com.internship.tool.entity.FileData;
import com.internship.tool.service.FileService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService service;

    public FileController(FileService service) {
        this.service = service;
    }

    // 🔹 Upload file
    @PostMapping("/upload")
    public FileData upload(@RequestParam("file") MultipartFile file) throws Exception {
        return service.uploadFile(file);
    }

    // 🔹 Download file
    @GetMapping("/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws Exception {

        FileData fileData = service.getFile(id);

        Path path = Paths.get(fileData.getFilePath());
        Resource resource = new UrlResource(path.toUri());

        // ✅ Check file exists
        if (!resource.exists()) {
            throw new RuntimeException("File not found on disk");
        }

        // ✅ Return with proper headers
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileData.getFileName() + "\"")
                .body(resource);
    }
}