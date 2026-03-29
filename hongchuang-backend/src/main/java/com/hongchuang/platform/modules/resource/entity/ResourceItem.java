package com.hongchuang.platform.modules.resource.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("resource_item")
public class ResourceItem extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long userId;
    private Long categoryId;
    private String title;
    private String summary;
    private String content;
    private String coverUrl;
    private Long currentVersionId;
    private String currentVersionNo;
    private String mcVersions;
    private String downloadType;
    private String downloadUrl;
    private String fileUrl;
    private Integer viewCount;
    private Integer downloadCount;
    private Integer likeCount;
    private Integer favoriteCount;
    private Integer commentCount;
    private Integer status;
    private Integer isRecommended;
    private String auditRemark;
    private Integer sortWeight;
}
