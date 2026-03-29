package com.hongchuang.platform.modules.report.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.report.dto.CreateReportRequest;
import com.hongchuang.platform.modules.report.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public Result<?> create(@Valid @RequestBody CreateReportRequest request) {
        return Result.success("举报提交成功", java.util.Map.of("reportId", reportService.create(request)));
    }
}
