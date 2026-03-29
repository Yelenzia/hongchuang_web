package com.hongchuang.platform.modules.announcement.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.announcement.entity.CmsAnnouncement;
import com.hongchuang.platform.modules.announcement.service.AnnouncementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping("/latest")
    public Result<List<CmsAnnouncement>> latest() {
        return Result.success(announcementService.latest());
    }

    @GetMapping
    public Result<Page<CmsAnnouncement>> page(@RequestParam(defaultValue = "1") long pageNo,
                                              @RequestParam(defaultValue = "10") long pageSize) {
        return Result.success(announcementService.pagePublished(pageNo, pageSize));
    }

    @GetMapping("/{id}")
    public Result<CmsAnnouncement> detail(@PathVariable Long id) {
        return Result.success(announcementService.detailPublished(id));
    }
}
