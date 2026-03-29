package com.hongchuang.platform.modules.resource.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResourceCategorySaveRequest {
    @NotBlank(message = "分类名称不能为空")
    private String name;
    @NotBlank(message = "分类标识不能为空")
    private String slug;
    private String description;
    private String icon;
    private Integer sortOrder;
    private Integer status;
}
