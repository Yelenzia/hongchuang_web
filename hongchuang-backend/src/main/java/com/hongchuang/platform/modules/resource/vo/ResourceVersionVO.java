package com.hongchuang.platform.modules.resource.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResourceVersionVO {
    private Long id;
    private Long resourceId;
    private String versionNo;
    private String changelog;
    private String mcVersions;
    private String downloadType;
    private String downloadUrl;
    private String fileUrl;
    private Integer status;
    private Integer isCurrent;
    private LocalDateTime createdAt;
}
