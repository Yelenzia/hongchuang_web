package com.hongchuang.platform.modules.resource.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResourceVersionSaveRequest {
    @NotBlank(message = "版本号不能为空")
    private String versionNo;
    private String changelog;
    private String mcVersions;
    @NotBlank(message = "下载方式不能为空")
    private String downloadType;
    private String downloadUrl;
    private String fileUrl;
    private Integer status;
}
