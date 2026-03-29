package com.hongchuang.platform.modules.content.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ContentDraftVO {
    private Long id;
    private String draftType;
    private String sceneCode;
    private Long ownerUserId;
    private String title;
    private String summary;
    private String contentMarkdown;
    private Map<String, Object> extraData;
    private Integer status;
    private Integer autoSaved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
