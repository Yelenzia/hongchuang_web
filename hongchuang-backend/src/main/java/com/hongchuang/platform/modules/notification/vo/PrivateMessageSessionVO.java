package com.hongchuang.platform.modules.notification.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PrivateMessageSessionVO {
    private Long targetUserId;
    private String username;
    private String nickname;
    private String avatarUrl;
    private String signature;
    private Integer userLevel;
    private String lastMessageContent;
    private LocalDateTime lastMessageTime;
    private Long lastMessageId;
    private Long unreadCount;
}
