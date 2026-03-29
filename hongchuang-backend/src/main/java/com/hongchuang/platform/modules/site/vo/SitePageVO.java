package com.hongchuang.platform.modules.site.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SitePageVO {
    private Long id;
    private String pageCode;
    private String pageName;
    private String title;
    private String subtitle;
    private String contentJson;
    private Integer status;
    private Integer sortOrder;
    private String updatedAt;
}
