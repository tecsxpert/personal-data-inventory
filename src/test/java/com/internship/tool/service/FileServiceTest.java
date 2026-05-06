package com.internship.tool.service;

import com.internship.tool.entity.FileData;
import com.internship.tool.repository.FileDataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FileServiceTest {

    @Mock
    private FileDataRepository repository;

    @InjectMocks
    private FileService service;

    // 🔥 FIX: manually set uploadDir before each test
    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(service, "uploadDir", "uploads/");
    }

    @Test
    void testUploadFile_success() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "Hello".getBytes()
        );

        when(repository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        FileData result = service.uploadFile(file);

        assertNotNull(result);
        assertNotNull(result.getFileName());
        verify(repository, times(1)).save(any());
    }

    @Test
    void testUploadFile_largeFile() {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                new byte[11 * 1024 * 1024] // >10MB
        );

        Exception ex = assertThrows(RuntimeException.class,
                () -> service.uploadFile(file));

        assertEquals("File size exceeds 10MB", ex.getMessage());
    }
}