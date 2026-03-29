package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.resource.dto.ResourceAuditRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceRecommendRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceStatusUpdateRequest;
import com.hongchuang.platform.modules.resource.service.ResourceService;
import com.hongchuang.platform.modules.resource.vo.ResourceDetailVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/resources")
@RequiredArgsConstructor
public class AdminResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public Result<Page<Map<String, Object>>> page(@RequestParam(defaultValue = "1") long pageNo,
                                                  @RequestParam(defaultValue = "10") long pageSize,
                                                  @RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) Long categoryId,
                                                  @RequestParam(required = false) Integer status) {
        return Result.success(resourceService.pageAdmin(pageNo, pageSize, keyword, categoryId, status));
    }

    @GetMapping("/{resourceId}")
    public Result<ResourceDetailVO> detail(@PathVariable Long resourceId) {
        return Result.success(resourceService.detailAdmin(resourceId));
    }

    @PatchMapping("/{resourceId}/audit")
    public Result<Void> audit(@PathVariable Long resourceId, @Valid @RequestBody ResourceAuditRequest request) {
        resourceService.audit(resourceId, request);
        return Result.success("审核完成", null);
    }

    @PatchMapping("/{resourceId}/status")
    public Result<Void> updateStatus(@PathVariable Long resourceId, @Valid @RequestBody ResourceStatusUpdateRequest request) {
        resourceService.updateAdminStatus(resourceId, request.getStatus());
        return Result.success("状态已更新", null);
    }

    @PatchMapping("/{resourceId}/recommend")
    public Result<Void> recommend(@PathVariable Long resourceId, @Valid @RequestBody ResourceRecommendRequest request) {
        resourceService.updateRecommend(resourceId, request.getRecommended());
        return Result.success("推荐状态已更新", null);
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        return Result.success(resourceService.statsAdmin());
    }
}
