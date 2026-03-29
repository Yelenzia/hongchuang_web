package com.hongchuang.platform.modules.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_user_profile")
public class SysUserProfile extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private Long userId;
    private String nickname;
    private String avatarUrl;
    private String signature;
    private String businessCard;
    private Integer userLevel;
    private Integer experiencePoints;
    private String bio;
    private Integer postCount;
    private Integer commentCount;
    private Integer favoriteCount;
    private Integer followingCount;
    private Integer followerCount;
    private Integer likeReceivedCount;
}
