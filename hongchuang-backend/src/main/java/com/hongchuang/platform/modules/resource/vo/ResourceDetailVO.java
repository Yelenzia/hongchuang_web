package com.hongchuang.platform.modules.resource.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ResourceDetailVO {
    private Long id;
    private String title;
    private Long categoryId;
    private String categoryName;
    private String summary;
    private String content;
    private String coverUrl;
    private Long authorId;
    private Long authorForumUid;
    private String authorName;
    private String authorAvatarUrl;
    private String authorSignature;
    private String authorBusinessCard;
    private Integer authorUserLevel;
    private String currentVersionNo;
    private String mcVersions;
    private String downloadType;
    private String downloadUrl;
    private String fileUrl;
    private Integer downloadCount;
    private Integer favoriteCount;
    private Integer likeCount;
    private Integer commentCount;
    private Integer viewCount;
    private Integer status;
    private Integer isRecommended;
    private Boolean isFavorited;
    private Boolean isLiked;
    private String auditRemark;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ResourceCardVO.TagVO> tags;
    private ResourceVersionVO currentVersion;
    private List<ResourceVersionVO> versions;
    private List<ResourceCardVO> relatedResources;
    private List<ResourceCommentVO> comments;
}
