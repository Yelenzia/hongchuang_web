package com.hongchuang.platform.modules.post.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostDetailVO {
    private Long id;
    private String title;
    private String summary;
    private String contentMd;
    private String contentHtml;
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
    private Integer viewCount;
    private LocalDateTime createdAt;
    private Boolean liked;
    private Boolean favorited;
    private Boolean blocked;
    private List<PostSummaryVO.TagVO> tags;
}
