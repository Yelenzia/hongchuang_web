package com.hongchuang.platform.modules.session.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserLoginSessionVO {
    private String sessionId;
    private String deviceType;
    private String deviceName;
    private String browser;
    private String os;
    private String loginIp;
    private LocalDateTime loginTime;
    private LocalDateTime lastActiveAt;
    private LocalDateTime expiresAt;
    private Integer status;
    private Boolean current;
}
