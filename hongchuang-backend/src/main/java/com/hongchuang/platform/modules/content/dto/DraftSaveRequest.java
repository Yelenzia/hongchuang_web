package com.hongchuang.platform.modules.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Map;

@Data
public class DraftSaveRequest {
    private Long id;

    @NotBlank(message = "草稿类型不能为空")
    private String draftType;

    private String sceneCode;

    @Size(max = 150, message = "标题不能超过 150 字")
    private String title;

    @Size(max = 500, message = "摘要不能超过 500 字")
    private String summary;

    private String contentMarkdown;

    private Map<String, Object> extraData;

    private Boolean autoSaved;
}
