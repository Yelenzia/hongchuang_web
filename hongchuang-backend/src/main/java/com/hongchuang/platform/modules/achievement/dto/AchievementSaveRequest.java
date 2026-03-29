package com.hongchuang.platform.modules.achievement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AchievementSaveRequest {
    @NotBlank
    @Size(max = 40)
    private String code;
    @NotBlank
    @Size(max = 40)
    private String name;
    @Size(max = 255)
    private String description;
    @Size(max = 40)
    private String icon;
    @Size(max = 20)
    private String color;
    @NotNull
    private Integer sortOrder;
    @NotNull
    private Integer status;
}
