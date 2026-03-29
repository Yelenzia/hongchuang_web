package com.hongchuang.platform.modules.report.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HandleReportRequest {
    @NotNull
    private Integer status;

    @Size(max = 500)
    private String handleNote;
}
