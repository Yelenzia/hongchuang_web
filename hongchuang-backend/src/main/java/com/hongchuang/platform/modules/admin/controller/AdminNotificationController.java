package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/notifications")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public Result<Page<Map<String, Object>>> page(@RequestParam(defaultValue = "1") long pageNo,
                                                  @RequestParam(defaultValue = "10") long pageSize,
                                                  @RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) String type,
                                                  @RequestParam(required = false) Integer isRead) {
        return Result.success(notificationService.pageAdmin(pageNo, pageSize, keyword, type, isRead));
    }

    @DeleteMapping("/{notificationId}")
    public Result<Void> delete(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return Result.success("通知已清理", null);
    }
}
