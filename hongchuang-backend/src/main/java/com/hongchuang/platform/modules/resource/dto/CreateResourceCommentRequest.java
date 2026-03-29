package com.hongchuang.platform.modules.resource.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateResourceCommentRequest {
    @NotBlank(message = "评论内容不能为空")
    private String content;
    private Long parentId;
    private Long rootId;
    private Long replyUserId;
}
