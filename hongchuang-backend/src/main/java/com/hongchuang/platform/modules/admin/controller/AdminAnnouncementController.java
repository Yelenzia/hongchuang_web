package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.announcement.dto.AnnouncementSaveRequest;
import com.hongchuang.platform.modules.announcement.entity.CmsAnnouncement;
import com.hongchuang.platform.modules.announcement.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/announcements")
public class AdminAnnouncementController {

    private final AnnouncementService announcementService;

    public AdminAnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public Result<Page<CmsAnnouncement>> page(@RequestParam(defaultValue = "1") long pageNo,
                                              @RequestParam(defaultValue = "10") long pageSize) {
        return Result.success(announcementService.pageAdmin(pageNo, pageSize));
    }

    @PostMapping
    public Result<?> create(@Valid @RequestBody AnnouncementSaveRequest request) {
        return Result.success("公告创建成功", Map.of("announcementId", announcementService.create(request)));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody AnnouncementSaveRequest request) {
        announcementService.update(id, request);
        return Result.success("公告更新成功", null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return Result.success("公告删除成功", null);
    }
}
