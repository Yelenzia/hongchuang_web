package com.hongchuang.platform.modules.notification.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationVO {
    private Long id;
    private String type;
    private String title;
    private String content;
    private Integer isRead;
    private Long relatedId;
    private String relatedType;
    private LocalDateTime createdAt;
}
