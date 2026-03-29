package com.hongchuang.platform.modules.announcement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AnnouncementSaveRequest {
    @NotBlank
    @Size(max = 120)
    private String title;

    @Size(max = 255)
    private String summary;

    @NotBlank
    private String content;

    private Integer isPinned;
    private Integer publishStatus;
}
