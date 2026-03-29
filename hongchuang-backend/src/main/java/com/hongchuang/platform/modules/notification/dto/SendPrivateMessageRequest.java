package com.hongchuang.platform.modules.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendPrivateMessageRequest {
    private Long toUserId;
    private String toUsername;
    private Long toForumUid;

    @NotBlank
    @Size(max = 1000)
    private String content;
}
