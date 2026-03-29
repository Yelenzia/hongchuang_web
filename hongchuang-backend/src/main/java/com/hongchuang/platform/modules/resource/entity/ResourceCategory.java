package com.hongchuang.platform.modules.resource.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("resource_category")
public class ResourceCategory extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String name;
    private String slug;
    private String description;
    private String icon;
    private Integer sortOrder;
    private Integer status;
    private Integer resourceCount;
}
