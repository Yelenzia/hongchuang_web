package com.hongchuang.platform.modules.content.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ContentTemplateVO {
    private Long id;
    private String templateName;
    private String templateType;
    private String sceneCode;
    private String titleExample;
    private String summaryExample;
    private String contentMarkdown;
    private Map<String, Object> extraData;
    private Integer enabled;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
