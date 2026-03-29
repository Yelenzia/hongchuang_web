package com.hongchuang.platform.modules.notification.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.notification.dto.SendPrivateMessageRequest;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import com.hongchuang.platform.modules.notification.vo.NotificationVO;
import com.hongchuang.platform.modules.notification.vo.PrivateMessageSessionVO;
import com.hongchuang.platform.modules.notification.vo.PrivateMessageVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public Result<List<NotificationVO>> myList() {
        return Result.success(notificationService.myNotifications());
    }

    @GetMapping("/unread-count")
    public Result<Map<String, Long>> unreadCount() {
        return Result.success(Map.of("unreadCount", notificationService.unreadCount()));
    }

    @PatchMapping("/{id}/read")
    public Result<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return Result.success("已读成功", null);
    }

    @PatchMapping("/read-all")
    public Result<Void> readAll() {
        notificationService.markAllRead();
        return Result.success("已全部设为已读", null);
    }

    @GetMapping("/private-messages/sessions")
    public Result<List<PrivateMessageSessionVO>> sessions(@RequestParam(required = false) String keyword) {
        return Result.success(notificationService.listSessions(keyword));
    }

    @PostMapping("/private-messages")
    public Result<Map<String, Long>> sendPrivateMessage(@Valid @RequestBody SendPrivateMessageRequest request) {
        return Result.success(Map.of("messageId", notificationService.sendPrivateMessage(request)));
    }

    @GetMapping("/private-messages/conversation")
    public Result<List<PrivateMessageVO>> conversationByQuery(@RequestParam(required = false) String targetUserId,
                                                              @RequestParam(required = false) String targetUsername) {
        if (StringUtils.isNotBlank(targetUserId)) {
            return Result.success(notificationService.conversation(Long.parseLong(targetUserId.trim())));
        }
        return Result.success(notificationService.conversation(targetUsername));
    }

    @GetMapping("/private-messages/{identifier}")
    public Result<List<PrivateMessageVO>> conversation(@PathVariable String identifier) {
        return Result.success(notificationService.conversation(identifier));
    }
}
