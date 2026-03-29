package com.hongchuang.platform.modules.resource.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("resource_tag_rel")
public class ResourceTagRel extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long resourceId;
    private Long tagId;
}
