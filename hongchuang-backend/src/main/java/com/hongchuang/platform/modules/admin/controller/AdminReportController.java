package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.report.dto.HandleReportRequest;
import com.hongchuang.platform.modules.report.entity.ForumReport;
import com.hongchuang.platform.modules.report.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/reports")
public class AdminReportController {

    private final ReportService reportService;

    public AdminReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public Result<Page<ForumReport>> page(@RequestParam(defaultValue = "1") long pageNo,
                                          @RequestParam(defaultValue = "10") long pageSize) {
        return Result.success(reportService.pageAdmin(pageNo, pageSize));
    }

    @PatchMapping("/{reportId}/handle")
    public Result<Void> handle(@PathVariable Long reportId, @Valid @RequestBody HandleReportRequest request) {
        reportService.handle(reportId, request);
        return Result.success("处理完成", null);
    }
}
