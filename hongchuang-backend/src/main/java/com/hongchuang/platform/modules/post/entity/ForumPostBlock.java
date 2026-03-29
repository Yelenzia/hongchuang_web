package com.hongchuang.platform.modules.post.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("forum_post_block")
public class ForumPostBlock {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long userId;
    private Long postId;
    private LocalDateTime createdAt;
}
