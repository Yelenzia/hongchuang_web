package com.hongchuang.platform.modules.content.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("content_draft")
public class ContentDraft extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String draftType;
    private String sceneCode;
    private Long ownerUserId;
    private String title;
    private String summary;
    private String contentMarkdown;
    private String extraJson;
    private Integer status;
    private Integer autoSaved;
}
