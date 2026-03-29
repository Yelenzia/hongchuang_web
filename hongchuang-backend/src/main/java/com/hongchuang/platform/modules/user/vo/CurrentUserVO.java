package com.hongchuang.platform.modules.user.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CurrentUserVO {
    private Long id;
    private Long forumUid;
    private String username;
    private String nickname;
    private String email;
    private String avatarUrl;
    private String signature;
    private String businessCard;
    private Integer userLevel;
    private Integer experiencePoints;
    private Integer nextLevelExp;
    private String bio;
    private String role;
    private LocalDateTime registerTime;
    private Integer postCount;
    private Integer commentCount;
    private Integer favoriteCount;
    private Integer followingCount;
    private Integer followerCount;
    private Boolean followedByCurrentUser;
    private Integer achievementCount;
}
