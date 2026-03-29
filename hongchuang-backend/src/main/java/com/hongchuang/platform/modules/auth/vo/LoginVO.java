package com.hongchuang.platform.modules.auth.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginVO {
    private String accessToken;
    private String tokenType;
    private Long expiresIn;
    private UserInfo userInfo;

    @Data
    @Builder
    public static class UserInfo {
        private Long id;
        private Long forumUid;
        private String username;
        private String nickname;
        private String avatarUrl;
        private String signature;
        private String businessCard;
        private Integer userLevel;
        private Integer experiencePoints;
        private String role;
    }
}
