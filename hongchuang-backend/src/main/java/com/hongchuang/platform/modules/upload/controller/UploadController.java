package com.hongchuang.platform.modules.upload.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.modules.content.service.UploadFileLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class UploadController {

    @Value("${upload.local-path:./uploads}")
    private String uploadLocalPath;

    private final UploadFileLogService uploadFileLogService;

    private static final long AVATAR_MAX_SIZE = 2L * 1024 * 1024;
    private static final long IMAGE_MAX_SIZE = 5L * 1024 * 1024;
    private static final long FILE_MAX_SIZE = 10L * 1024 * 1024;

    private static final Set<String> AVATAR_ALLOWED = Set.of("jpg", "jpeg", "png", "webp", "gif");
    private static final Set<String> IMAGE_ALLOWED = Set.of("jpg", "jpeg", "png", "webp", "gif", "bmp");
    private static final Set<String> FILE_ALLOWED = Set.of(
            "txt", "md", "pdf", "zip", "rar", "7z", "doc", "docx", "xls", "xlsx", "json", "yml", "yaml",
            "png", "jpg", "jpeg", "webp"
    );

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<Map<String, Object>> uploadAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        validateFile(file, AVATAR_MAX_SIZE, AVATAR_ALLOWED, "头像");
        Map<String, Object> data = saveFile(file, "avatar", false);
        record("AVATAR", file, data);
        return Result.success(data);
    }

    @PostMapping(value = "/post-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<Map<String, Object>> uploadPostImage(@RequestParam("file") MultipartFile file) throws IOException {
        validateFile(file, IMAGE_MAX_SIZE, IMAGE_ALLOWED, "帖子图片");
        Map<String, Object> data = saveFile(file, "post/image", true);
        data.put("markdown", "![]("
                + data.get("url")
                + ")");
        record("POST_IMAGE", file, data);
        return Result.success(data);
    }

    @PostMapping(value = "/editor-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<Map<String, Object>> uploadEditorImage(@RequestParam("file") MultipartFile file) throws IOException {
        validateFile(file, IMAGE_MAX_SIZE, IMAGE_ALLOWED, "编辑器图片");
        Map<String, Object> data = saveFile(file, "editor/image", true);
        data.put("markdown", "![]("
                + data.get("url")
                + ")");
        record("EDITOR_IMAGE", file, data);
        return Result.success(data);
    }

    @PostMapping(value = "/resource-cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<Map<String, Object>> uploadResourceCover(@RequestParam("file") MultipartFile file) throws IOException {
        validateFile(file, IMAGE_MAX_SIZE, IMAGE_ALLOWED, "资源封面");
        Map<String, Object> data = saveFile(file, "resource/cover", true);
        record("RESOURCE_COVER", file, data);
        return Result.success(data);
    }

    @PostMapping(value = "/post-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<Map<String, Object>> uploadPostFile(@RequestParam("file") MultipartFile file) throws IOException {
        validateFile(file, FILE_MAX_SIZE, FILE_ALLOWED, "附件");
        Map<String, Object> data = saveFile(file, "post/file", true);
        data.put("markdown", "[附件：" + data.get("name") + "](" + data.get("url") + ")");
        record("POST_FILE", file, data);
        return Result.success(data);
    }

    private void validateFile(MultipartFile file, long maxSize, Set<String> allowedExtensions, String bizName) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(bizName + "不能为空");
        }
        if (file.getSize() > maxSize) {
            throw new BusinessException(bizName + "大小超出限制");
        }
        String ext = getExtension(file.getOriginalFilename());
        if (!StringUtils.hasText(ext) || !allowedExtensions.contains(ext.toLowerCase(Locale.ROOT))) {
            throw new BusinessException(bizName + "文件类型不支持");
        }
    }

    private Map<String, Object> saveFile(MultipartFile file, String bizDir, boolean keepOriginalName) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String ext = getExtension(originalFilename).toLowerCase(Locale.ROOT);
        String safeBaseName = sanitizeBaseName(removeExtension(originalFilename));
        if (!StringUtils.hasText(safeBaseName)) {
            safeBaseName = "file";
        }

        String dateDir = LocalDate.now().toString().replace("-", "");
        Path baseDir = Paths.get(uploadLocalPath).toAbsolutePath().normalize();
        Path dirPath = baseDir.resolve(Paths.get(bizDir, dateDir)).normalize();
        Files.createDirectories(dirPath);

        String storedName;
        if (keepOriginalName) {
            storedName = UUID.randomUUID().toString().replace("-", "") + "_" + safeBaseName + "." + ext;
        } else {
            storedName = UUID.randomUUID().toString().replace("-", "") + "." + ext;
        }

        Path target = dirPath.resolve(storedName).normalize();
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        String relativePath = "/uploads/" + bizDir + "/" + dateDir + "/" + storedName;
        Map<String, Object> data = new HashMap<>();
        data.put("url", relativePath);
        data.put("relativePath", relativePath);
        data.put("name", safeBaseName + "." + ext);
        data.put("originalName", originalFilename);
        data.put("size", file.getSize());
        data.put("contentType", file.getContentType());
        return data;
    }

    private void record(String bizType, MultipartFile file, Map<String, Object> data) {
        uploadFileLogService.record(
                CurrentUserUtils.getCurrentUserId(),
                bizType,
                String.valueOf(data.getOrDefault("name", file.getOriginalFilename())),
                String.valueOf(data.get("url")),
                getExtension(file.getOriginalFilename()),
                file.getContentType(),
                file.getSize()
        );
    }

    private String getExtension(String filename) {
        if (!StringUtils.hasText(filename)) {
            return "";
        }
        int index = filename.lastIndexOf('.');
        if (index < 0 || index == filename.length() - 1) {
            return "";
        }
        return filename.substring(index + 1);
    }

    private String removeExtension(String filename) {
        if (!StringUtils.hasText(filename)) {
            return "";
        }
        int index = filename.lastIndexOf('.');
        if (index < 0) {
            return filename;
        }
        return filename.substring(0, index);
    }

    private String sanitizeBaseName(String value) {
        if (!StringUtils.hasText(value)) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (char c : value.toCharArray()) {
            if (Character.isLetterOrDigit(c) || c == '_' || c == '-' || c == '.') {
                sb.append(c);
            } else if (isCjk(c)) {
                sb.append(c);
            } else {
                sb.append('_');
            }
        }
        String result = sb.toString();
        while (result.contains("__")) {
            result = result.replace("__", "_");
        }
        return result;
    }

    private boolean isCjk(char c) {
        Character.UnicodeBlock block = Character.UnicodeBlock.of(c);
        return block == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
                || block == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
                || block == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_B
                || block == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS;
    }
}
