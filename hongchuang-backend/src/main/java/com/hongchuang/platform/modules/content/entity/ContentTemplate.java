package com.hongchuang.platform.modules.content.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("content_template")
public class ContentTemplate extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String templateName;
    private String templateType;
    private String sceneCode;
    private String titleExample;
    private String summaryExample;
    private String contentMarkdown;
    private String extraJson;
    private Integer enabled;
    private Integer sortOrder;
}
