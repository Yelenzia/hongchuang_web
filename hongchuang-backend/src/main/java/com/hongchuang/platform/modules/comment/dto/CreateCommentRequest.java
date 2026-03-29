package com.hongchuang.platform.modules.comment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCommentRequest {
    private Long parentId = 0L;
    private Long replyUserId;
    @NotBlank
    private String content;
}
