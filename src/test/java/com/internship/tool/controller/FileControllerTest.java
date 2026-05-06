package com.internship.tool.controller;

import com.internship.tool.service.FileService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FileControllerTest {

    private final FileService service = mock(FileService.class);
    private final FileController controller = new FileController(service);

    @Test
    void testDownload() throws Exception {

        when(service.getFile(1L)).thenThrow(new RuntimeException("File not found"));

        Exception ex = assertThrows(RuntimeException.class,
                () -> controller.download(1L));

        assertEquals("File not found", ex.getMessage());
    }
}