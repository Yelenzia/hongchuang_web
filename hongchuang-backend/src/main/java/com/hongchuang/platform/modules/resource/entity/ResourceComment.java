package com.hongchuang.platform.modules.resource.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("resource_comment")
public class ResourceComment extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long resourceId;
    private Long userId;
    private Long parentId;
    private Long rootId;
    private Long replyUserId;
    private String content;
    private Integer status;
}
