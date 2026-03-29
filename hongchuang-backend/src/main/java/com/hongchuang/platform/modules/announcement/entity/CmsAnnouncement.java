package com.hongchuang.platform.modules.announcement.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("cms_announcement")
public class CmsAnnouncement extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String title;
    private String summary;
    private String content;
    private Integer isPinned;
    private Integer publishStatus;
    private LocalDateTime publishedAt;
    private Long createdBy;
    private Long updatedBy;
}
