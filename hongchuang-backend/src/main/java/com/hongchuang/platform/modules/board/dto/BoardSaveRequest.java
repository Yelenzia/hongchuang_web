package com.hongchuang.platform.modules.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BoardSaveRequest {
    @NotBlank
    @Size(max = 50)
    private String name;

    @NotBlank
    @Size(max = 50)
    private String slug;

    @Size(max = 255)
    private String description;

    @Size(max = 100)
    private String icon;

    private Integer sortOrder;
    private Integer isPublic;
    private Integer status;
}
