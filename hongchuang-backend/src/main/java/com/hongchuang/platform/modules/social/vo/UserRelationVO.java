package com.hongchuang.platform.modules.social.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRelationVO {
    private Long userId;
    private Long forumUid;
    private String username;
    private String nickname;
    private String avatarUrl;
    private String signature;
    private String businessCard;
    private Integer userLevel;
    private Integer postCount;
    private Integer commentCount;
    private Integer followerCount;
    private Integer followingCount;
    private Boolean followedByMe;
}
