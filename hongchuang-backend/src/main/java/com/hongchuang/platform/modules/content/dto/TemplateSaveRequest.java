package com.hongchuang.platform.modules.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Map;

@Data
public class TemplateSaveRequest {
    @NotBlank(message = "模板名称不能为空")
    @Size(max = 80, message = "模板名称不能超过 80 字")
    private String templateName;

    @NotBlank(message = "模板类型不能为空")
    private String templateType;

    @NotBlank(message = "场景编码不能为空")
    private String sceneCode;

    @Size(max = 150, message = "示例标题不能超过 150 字")
    private String titleExample;

    @Size(max = 500, message = "示例摘要不能超过 500 字")
    private String summaryExample;

    private String contentMarkdown;

    private Map<String, Object> extraData;

    private Integer enabled;
    private Integer sortOrder;
}
