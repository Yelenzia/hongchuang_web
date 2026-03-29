package com.hongchuang.platform.modules.post.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("forum_post")
public class ForumPost extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long userId;
    private Long boardId;
    private String title;
    private String summary;
    private String contentMd;
    private String contentHtml;
    private String coverUrl;
    private Integer viewCount;
    private Integer likeCount;
    private Integer favoriteCount;
    private Integer commentCount;
    private BigDecimal hotScore;
    private Integer isTop;
    private Integer isRecommended;
    private Integer status;
    private Integer auditStatus;
}
