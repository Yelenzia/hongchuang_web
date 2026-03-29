package com.hongchuang.platform.modules.tag.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("forum_tag")
public class ForumTag extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String name;
    private String slug;
    private Integer postCount;
    private Integer status;
}
