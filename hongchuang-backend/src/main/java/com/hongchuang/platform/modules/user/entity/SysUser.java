package com.hongchuang.platform.modules.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_user")
public class SysUser extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String username;
    private String email;
    private String passwordHash;
    private String role;
    private Integer status;
    private Integer emailVerified;
    private LocalDateTime lastLoginAt;
    private String lastLoginIp;
    private String registerIp;
    private Long forumUid;
}
