package com.hongchuang.platform.modules.resource.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceCategoryStatusUpdateRequest {
    @NotNull(message = "状态不能为空")
    private Integer status;
}
