package com.hongchuang.platform.modules.resource.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ResourceSaveRequest {
    @NotNull(message = "分类不能为空")
    private Long categoryId;
    @NotBlank(message = "资源标题不能为空")
    private String title;
    private String summary;
    private String content;
    private String coverUrl;
    private List<Long> tagIds;
    @Valid
    @NotNull(message = "主版本信息不能为空")
    private ResourceVersionSaveRequest initialVersion;
    private Boolean saveAsDraft;
}
