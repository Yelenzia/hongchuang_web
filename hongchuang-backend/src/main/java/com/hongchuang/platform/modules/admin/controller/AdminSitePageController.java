package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.site.dto.SitePageSaveRequest;
import com.hongchuang.platform.modules.site.entity.CmsSitePage;
import com.hongchuang.platform.modules.site.service.SitePageService;
import com.hongchuang.platform.modules.site.vo.SitePageVO;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/site-pages")
@RequiredArgsConstructor
public class AdminSitePageController {

    private final SitePageService sitePageService;

    @GetMapping
    public Result<Page<CmsSitePage>> page(@RequestParam(defaultValue = "1") long pageNo,
                                          @RequestParam(defaultValue = "20") long pageSize,
                                          @RequestParam(required = false) String keyword,
                                          @RequestParam(required = false) Integer status) {
        return Result.success(sitePageService.pageAdmin(pageNo, pageSize, keyword, status));
    }

    @GetMapping("/{id}")
    public Result<SitePageVO> detail(@PathVariable Long id) {
        return Result.success(sitePageService.detailAdmin(id));
    }

    @PostMapping
    public Result<Map<String, Object>> create(@Valid @RequestBody SitePageSaveRequest request) {
        return Result.success("页面配置创建成功", Map.of("sitePageId", sitePageService.create(request)));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody SitePageSaveRequest request) {
        sitePageService.update(id, request);
        return Result.success("页面配置更新成功", null);
    }

    @PatchMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestBody UpdateSitePageStatusRequest request) {
        sitePageService.updateStatus(id, request.getStatus());
        return Result.success("页面状态已更新", null);
    }

    @Data
    public static class UpdateSitePageStatusRequest {
        private Integer status;
    }
}
