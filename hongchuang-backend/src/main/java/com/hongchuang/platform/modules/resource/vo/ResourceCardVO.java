package com.hongchuang.platform.modules.resource.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ResourceCardVO {
    private Long id;
    private String title;
    private Long categoryId;
    private String categoryName;
    private String summary;
    private String coverUrl;
    private Long authorId;
    private Long authorForumUid;
    private String authorName;
    private String authorAvatarUrl;
    private String currentVersionNo;
    private String mcVersions;
    private Integer downloadCount;
    private Integer favoriteCount;
    private Integer likeCount;
    private Integer commentCount;
    private Integer isRecommended;
    private Integer status;
    private LocalDateTime createdAt;
    private List<TagVO> tags;

    @Data
    @Builder
    public static class TagVO {
        private Long id;
        private String name;
    }
}
