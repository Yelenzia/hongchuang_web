package com.hongchuang.platform.modules.comment.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentVO {
    private Long id;
    private Long postId;
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
}
