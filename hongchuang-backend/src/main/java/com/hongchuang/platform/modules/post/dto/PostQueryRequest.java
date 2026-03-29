package com.hongchuang.platform.modules.post.dto;

import lombok.Data;

@Data
public class PostQueryRequest {
    private Long pageNo = 1L;
    private Long pageSize = 10L;
    private Long boardId;
    private Long tagId;
    private Long authorId;
    private String keyword;
    private String sort = "newest";
}
