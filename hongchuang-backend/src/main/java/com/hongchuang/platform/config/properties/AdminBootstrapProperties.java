package com.hongchuang.platform.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "hongchuang.bootstrap.admin")
public class AdminBootstrapProperties {
    private boolean enabled = true;
    private String username = "admin";
    private String email = "admin@hongchuang.local";
    private String password = "Admin@123456";
    private String nickname = "系统管理员";
}
