package com.hongchuang.platform.modules.resource.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceRecommendRequest {
    @NotNull(message = "推荐状态不能为空")
    private Boolean recommended;
}
