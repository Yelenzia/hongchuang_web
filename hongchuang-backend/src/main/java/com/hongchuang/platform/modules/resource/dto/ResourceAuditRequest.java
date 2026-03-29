package com.hongchuang.platform.modules.resource.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceAuditRequest {
    @NotNull(message = "审核结果不能为空")
    private Boolean pass;
    private String remark;
}
