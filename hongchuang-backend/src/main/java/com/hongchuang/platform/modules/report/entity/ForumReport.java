package com.hongchuang.platform.modules.report.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("forum_report")
public class ForumReport {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long reporterId;
    private String targetType;
    private Long targetId;
    private String reasonType;
    private String reasonDetail;
    private Integer status;
    private Long handlerId;
    private String handleNote;
    private LocalDateTime handledAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
