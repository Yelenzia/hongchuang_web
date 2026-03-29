package com.hongchuang.platform.modules.post.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostSummaryVO {
    private Long id;
    private String title;
    private String summary;
    private Long authorId;
    private Long authorForumUid;
    private String authorName;
    private String authorAvatarUrl;
    private String authorSignature;
    private String authorBusinessCard;
    private Integer authorUserLevel;
    private Long boardId;
    private String boardName;
    private Integer likeCount;
    private Integer favoriteCount;
    private Integer commentCount;
    private LocalDateTime createdAt;
    private List<TagVO> tags;

    @Data
    @Builder
    public static class TagVO {
        private Long id;
        private String name;
    }
}
