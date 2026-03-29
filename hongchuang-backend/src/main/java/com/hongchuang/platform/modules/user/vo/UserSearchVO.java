package com.hongchuang.platform.modules.user.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSearchVO {
    private Long userId;
    private Long forumUid;
    private String username;
    private String nickname;
    private String avatarUrl;
    private String signature;
    private Integer userLevel;
}
