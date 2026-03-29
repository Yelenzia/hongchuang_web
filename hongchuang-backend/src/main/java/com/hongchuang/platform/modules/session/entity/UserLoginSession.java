package com.hongchuang.platform.modules.session.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_login_session")
public class UserLoginSession extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String sessionId;
    private Long userId;
    private String tokenHash;
    private String deviceType;
    private String deviceName;
    private String browser;
    private String os;
    private String loginIp;
    private LocalDateTime lastActiveAt;
    private LocalDateTime expiresAt;
    private Integer status;
    private LocalDateTime revokedAt;
}
