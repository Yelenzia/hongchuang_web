package com.hongchuang.platform.modules.resource.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResourceCategoryVO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String icon;
    private Integer sortOrder;
    private Integer status;
    private Integer resourceCount;
}
