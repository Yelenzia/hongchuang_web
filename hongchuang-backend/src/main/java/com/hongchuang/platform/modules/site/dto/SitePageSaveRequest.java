package com.hongchuang.platform.modules.site.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SitePageSaveRequest {
    @NotBlank
    @Size(max = 50)
    private String pageCode;

    @NotBlank
    @Size(max = 80)
    private String pageName;

    @Size(max = 150)
    private String title;

    @Size(max = 500)
    private String subtitle;

    @NotBlank
    private String contentJson;

    private Integer status;
    private Integer sortOrder;
}
