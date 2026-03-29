package com.hongchuang.platform.modules.resource.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("resource_version")
public class ResourceVersion extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long resourceId;
    private String versionNo;
    private String changelog;
    private String mcVersions;
    private String downloadType;
    private String downloadUrl;
    private String fileUrl;
    private Integer isCurrent;
    private Integer status;
}
