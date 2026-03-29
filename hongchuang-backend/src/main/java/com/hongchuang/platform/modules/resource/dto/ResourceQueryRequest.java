package com.hongchuang.platform.modules.resource.dto;

import lombok.Data;

@Data
public class ResourceQueryRequest {
    private Long pageNo = 1L;
    private Long pageSize = 12L;
    private Long categoryId;
    private Long tagId;
    private String keyword;
    private String sort = "latest";
}
