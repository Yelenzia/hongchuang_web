package com.hongchuang.platform.modules.upload.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UploadPublicController {

    @Value("${upload.local-path:./uploads}")
    private String uploadLocalPath;

    @GetMapping("/uploads/**")
    public ResponseEntity<Resource> serve(HttpServletRequest request) throws IOException {
        String uri = request.getRequestURI();
        String prefix = "/uploads/";
        int idx = uri.indexOf(prefix);
        if (idx < 0) {
            return ResponseEntity.notFound().build();
        }
        String relative = uri.substring(idx + prefix.length());
        if (!StringUtils.hasText(relative)) {
            return ResponseEntity.notFound().build();
        }
        relative = relative.replace('\\', '/');
        while (relative.startsWith("/")) {
            relative = relative.substring(1);
        }

        Path file = findFile(relative);
        if (file == null || !Files.exists(file) || !Files.isRegularFile(file)) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(file);
        if (!StringUtils.hasText(contentType)) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    private Path findFile(String relative) {
        List<Path> bases = new ArrayList<>();
        bases.add(Paths.get(uploadLocalPath).toAbsolutePath().normalize());
        bases.add(Paths.get(System.getProperty("user.dir"), "uploads").toAbsolutePath().normalize());
        bases.add(Paths.get("uploads").toAbsolutePath().normalize());
        bases.add(Paths.get(System.getProperty("user.dir"), "hongchuang-backend", "uploads").toAbsolutePath().normalize());

        for (Path base : bases) {
            Path candidate = base.resolve(relative).normalize();
            if (candidate.startsWith(base) && Files.exists(candidate) && Files.isRegularFile(candidate)) {
                return candidate;
            }
        }
        return null;
    }
}
