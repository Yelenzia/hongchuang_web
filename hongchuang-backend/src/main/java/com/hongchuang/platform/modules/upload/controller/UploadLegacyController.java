package com.hongchuang.platform.modules.upload.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class UploadLegacyController {

    @Value("${upload.local-path:./uploads}")
    private String uploadLocalPath;

    @GetMapping("/uploads/{date}/{filename:.+}")
    public ResponseEntity<Resource> loadLegacyAvatar(@PathVariable String date, @PathVariable String filename) {
        Path base = Paths.get(uploadLocalPath).toAbsolutePath().normalize();
        Path preferred = base.resolve(Paths.get(date, filename)).normalize();
        File preferredFile = preferred.toFile();
        if (preferredFile.exists() && preferredFile.isFile()) {
            return toResponse(preferredFile);
        }
        Path avatarFallback = base.resolve(Paths.get("avatar", date, filename)).normalize();
        File avatarFile = avatarFallback.toFile();
        if (avatarFile.exists() && avatarFile.isFile()) {
            return toResponse(avatarFile);
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<Resource> toResponse(File file) {
        FileSystemResource resource = new FileSystemResource(file);
        String contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        String fileName = file.getName().toLowerCase();
        if (fileName.endsWith(".png")) {
            contentType = MediaType.IMAGE_PNG_VALUE;
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        } else if (fileName.endsWith(".gif")) {
            contentType = MediaType.IMAGE_GIF_VALUE;
        } else if (fileName.endsWith(".webp")) {
            contentType = "image/webp";
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
