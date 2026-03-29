package com.hongchuang.platform.modules.resource.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ResourceCommentVO {
    private Long id;
    private Long resourceId;
    private Long userId;
    private Long forumUid;
    private String username;
    private String nickname;
    private String avatarUrl;
    private String signature;
    private String businessCard;
    private Integer userLevel;
    private Long parentId;
    private Long rootId;
    private Long replyUserId;
    private String replyNickname;
    private Long replyForumUid;
    private String content;
    private LocalDateTime createdAt;
    private List<ResourceCommentVO> children;
}
