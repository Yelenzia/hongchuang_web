package com.hongchuang.platform.modules.social.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_follow")
public class UserFollow extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long followerUserId;
    private Long followeeUserId;
}
