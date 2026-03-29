package com.hongchuang.platform.modules.achievement.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AchievementVO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String icon;
    private String color;
    private LocalDateTime obtainedAt;
    private Boolean obtained;
}
