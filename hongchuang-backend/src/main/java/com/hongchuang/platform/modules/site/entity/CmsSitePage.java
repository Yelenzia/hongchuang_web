package com.hongchuang.platform.modules.site.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("cms_site_page")
public class CmsSitePage extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private String pageCode;
    private String pageName;
    private String title;
    private String subtitle;
    private String contentJson;
    private Integer status;
    private Integer sortOrder;
}
