package com.internship.tool.service;

import com.internship.tool.entity.FileData;
import com.internship.tool.repository.FileDataRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final FileDataRepository repository;

    public FileService(FileDataRepository repository) {
        this.repository = repository;
    }

    public FileData uploadFile(MultipartFile file) throws IOException {

        // ✅ 1. File size validation (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 10MB");
        }

        // ✅ 2. File type validation
        String contentType = file.getContentType();

        if (contentType == null ||
                (!contentType.equals("application/pdf") &&
                        !contentType.equals("image/png") &&
                        !contentType.equals("image/jpeg") &&
                        !contentType.equals("application/octet-stream"))) {

            throw new RuntimeException("Invalid file type");
        }

        // ✅ 3. Safe filename handling
        String originalName = file.getOriginalFilename();

        if (originalName == null || !originalName.contains(".")) {
            throw new RuntimeException("Invalid file name");
        }

        String extension = originalName.substring(originalName.lastIndexOf("."));
        String fileName = UUID.randomUUID() + extension;

        // ✅ 4. Build file path safely
        String filePath = uploadDir + File.separator + fileName;

        // ✅ 5. Create directory if not exists
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // ✅ 6. Save file to disk
        file.transferTo(new File(filePath));

        // ✅ 7. Save metadata to DB
        FileData data = new FileData();
        data.setFileName(fileName);
        data.setFilePath(filePath);

        return repository.save(data);
    }

    // ✅ Fetch file metadata
    public FileData getFile(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }
}