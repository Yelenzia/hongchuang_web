package com.hongchuang.platform.modules.notification.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.notification.dto.SendPrivateMessageRequest;
import com.hongchuang.platform.modules.notification.entity.PrivateMessage;
import com.hongchuang.platform.modules.notification.entity.UserNotification;
import com.hongchuang.platform.modules.notification.mapper.PrivateMessageMapper;
import com.hongchuang.platform.modules.notification.mapper.UserNotificationMapper;
import com.hongchuang.platform.modules.notification.vo.NotificationVO;
import com.hongchuang.platform.modules.notification.vo.PrivateMessageSessionVO;
import com.hongchuang.platform.modules.notification.vo.PrivateMessageVO;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final UserNotificationMapper userNotificationMapper;
    private final PrivateMessageMapper privateMessageMapper;
    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;

    public List<NotificationVO> myNotifications() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        return userNotificationMapper.selectList(new LambdaQueryWrapper<UserNotification>()
                        .eq(UserNotification::getUserId, userId)
                        .orderByDesc(UserNotification::getCreatedAt)
                        .last("limit 100"))
                .stream().map(item -> NotificationVO.builder()
                        .id(item.getId())
                        .type(item.getType())
                        .title(item.getTitle())
                        .content(item.getContent())
                        .isRead(item.getIsRead())
                        .relatedId(item.getRelatedId())
                        .relatedType(item.getRelatedType())
                        .createdAt(item.getCreatedAt())
                        .build()).toList();
    }

    public long unreadCount() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        return userNotificationMapper.selectCount(new LambdaQueryWrapper<UserNotification>()
                .eq(UserNotification::getUserId, userId)
                .eq(UserNotification::getIsRead, 0));
    }

    @Transactional(rollbackFor = Exception.class)
    public void markRead(Long id) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        UserNotification item = userNotificationMapper.selectById(id);
        if (item == null || !item.getUserId().equals(userId)) {
            throw new BusinessException("消息不存在");
        }
        item.setIsRead(1);
        userNotificationMapper.updateById(item);
    }

    @Transactional(rollbackFor = Exception.class)
    public void markAllRead() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        List<UserNotification> list = userNotificationMapper.selectList(new LambdaQueryWrapper<UserNotification>()
                .eq(UserNotification::getUserId, userId)
                .eq(UserNotification::getIsRead, 0));
        for (UserNotification item : list) {
            item.setIsRead(1);
            userNotificationMapper.updateById(item);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void push(Long userId, String type, String title, String content, Long relatedId, String relatedType) {
        if (userId == null) {
            return;
        }
        UserNotification item = new UserNotification();
        item.setUserId(userId);
        item.setType(type);
        item.setTitle(title);
        item.setContent(content);
        item.setIsRead(0);
        item.setRelatedId(relatedId);
        item.setRelatedType(relatedType);
        userNotificationMapper.insert(item);
    }

    @Transactional(rollbackFor = Exception.class)
    public Long sendPrivateMessage(SendPrivateMessageRequest request) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        Long targetUserId = resolveTargetUserId(request);
        if (userId.equals(targetUserId)) {
            throw new BusinessException("不能给自己发送私信");
        }
        PrivateMessage item = new PrivateMessage();
        item.setFromUserId(userId);
        item.setToUserId(targetUserId);
        item.setContent(SanitizeUtils.cleanText(request.getContent()));
        item.setIsRead(0);
        privateMessageMapper.insert(item);
        push(targetUserId, "PRIVATE_MESSAGE", "你收到一条私信", item.getContent(), item.getId(), "PRIVATE_MESSAGE");
        return item.getId();
    }

    public List<PrivateMessageVO> conversation(String identifier) {
        Long targetUserId = resolveIdentifier(identifier);
        return conversation(targetUserId);
    }

    public List<PrivateMessageVO> conversation(Long targetUserId, String targetUsername) {
        Long resolvedTargetUserId = targetUserId;
        if (resolvedTargetUserId == null && StringUtils.isNotBlank(targetUsername)) {
            SysUser byUsername = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                    .eq(SysUser::getUsername, targetUsername.trim())
                    .last("limit 1"));
            if (byUsername != null) {
                resolvedTargetUserId = byUsername.getId();
            }
        }
        if (resolvedTargetUserId == null) {
            throw new BusinessException("目标用户不存在");
        }
        return conversation(resolvedTargetUserId);
    }

    public List<PrivateMessageVO> conversation(Long targetUserId) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        if (targetUserId == null) {
            throw new BusinessException("目标用户不存在");
        }
        List<PrivateMessage> list = privateMessageMapper.selectConversation(userId, targetUserId);
        for (PrivateMessage item : list) {
            if (item.getToUserId().equals(userId) && (item.getIsRead() == null || item.getIsRead() == 0)) {
                item.setIsRead(1);
                privateMessageMapper.updateById(item);
            }
        }
        return list.stream().map(item -> PrivateMessageVO.builder()
                .id(item.getId())
                .fromUserId(item.getFromUserId())
                .toUserId(item.getToUserId())
                .content(item.getContent())
                .isRead(item.getIsRead())
                .createdAt(item.getCreatedAt())
                .build()).toList();
    }

    public List<PrivateMessageSessionVO> listSessions(String keyword) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        List<PrivateMessage> recentMessages = privateMessageMapper.selectList(new LambdaQueryWrapper<PrivateMessage>()
                .and(w -> w.eq(PrivateMessage::getFromUserId, userId).or().eq(PrivateMessage::getToUserId, userId))
                .orderByDesc(PrivateMessage::getCreatedAt)
                .last("limit 500"));
        if (recentMessages.isEmpty()) {
            return List.of();
        }

        Map<Long, PrivateMessage> latestMessageByTarget = new HashMap<>();
        for (PrivateMessage item : recentMessages) {
            Long targetUserId = item.getFromUserId().equals(userId) ? item.getToUserId() : item.getFromUserId();
            latestMessageByTarget.putIfAbsent(targetUserId, item);
        }
        List<Long> targetUserIds = new ArrayList<>(latestMessageByTarget.keySet());
        Map<Long, SysUser> userMap = sysUserMapper.selectBatchIds(targetUserIds).stream()
                .collect(java.util.stream.Collectors.toMap(SysUser::getId, Function.identity(), (a, b) -> a));
        Map<Long, SysUserProfile> profileMap = sysUserProfileMapper.selectList(new LambdaQueryWrapper<SysUserProfile>()
                        .in(SysUserProfile::getUserId, targetUserIds))
                .stream().collect(java.util.stream.Collectors.toMap(SysUserProfile::getUserId, Function.identity(), (a, b) -> a));

        String keywordText = StringUtils.trimToEmpty(keyword).toLowerCase();
        return targetUserIds.stream().map(targetUserId -> {
            SysUser targetUser = userMap.get(targetUserId);
            if (targetUser == null || (targetUser.getDeleted() != null && targetUser.getDeleted() == 1)) {
                return null;
            }
            SysUserProfile profile = profileMap.get(targetUserId);
            String username = targetUser.getUsername();
            String nickname = profile == null || StringUtils.isBlank(profile.getNickname()) ? username : profile.getNickname();
            if (StringUtils.isNotBlank(keywordText)) {
                String haystack = (username + " " + nickname).toLowerCase();
                if (!haystack.contains(keywordText)) {
                    return null;
                }
            }
            PrivateMessage latestMessage = latestMessageByTarget.get(targetUserId);
            long unreadCount = privateMessageMapper.selectCount(new LambdaQueryWrapper<PrivateMessage>()
                    .eq(PrivateMessage::getFromUserId, targetUserId)
                    .eq(PrivateMessage::getToUserId, userId)
                    .eq(PrivateMessage::getIsRead, 0));
            return PrivateMessageSessionVO.builder()
                    .targetUserId(targetUserId)
                    .username(username)
                    .nickname(nickname)
                    .avatarUrl(profile == null ? null : profile.getAvatarUrl())
                    .signature(profile == null ? null : profile.getSignature())
                    .userLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                    .lastMessageId(latestMessage == null ? null : latestMessage.getId())
                    .lastMessageContent(latestMessage == null ? null : latestMessage.getContent())
                    .lastMessageTime(latestMessage == null ? null : latestMessage.getCreatedAt())
                    .unreadCount(unreadCount)
                    .build();
        }).filter(java.util.Objects::nonNull)
                .sorted(Comparator.comparing(PrivateMessageSessionVO::getLastMessageTime,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    public Page<Map<String, Object>> pageAdmin(long pageNo, long pageSize, String keyword, String type, Integer isRead) {
        LambdaQueryWrapper<UserNotification> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(type)) {
            wrapper.eq(UserNotification::getType, type.trim());
        }
        if (isRead != null) {
            wrapper.eq(UserNotification::getIsRead, isRead);
        }
        if (StringUtils.isNotBlank(keyword)) {
            wrapper.and(w -> w.like(UserNotification::getTitle, keyword)
                    .or().like(UserNotification::getContent, keyword));
        }
        wrapper.orderByDesc(UserNotification::getCreatedAt);
        Page<UserNotification> page = userNotificationMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
        Page<Map<String, Object>> result = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        result.setRecords(page.getRecords().stream().map(this::toAdminRow).toList());
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteNotification(Long notificationId) {
        UserNotification item = userNotificationMapper.selectById(notificationId);
        if (item == null) {
            throw new BusinessException("通知不存在");
        }
        userNotificationMapper.deleteById(notificationId);
    }

    private Map<String, Object> toAdminRow(UserNotification item) {
        Map<String, Object> row = new HashMap<>();
        SysUser user = sysUserMapper.selectById(item.getUserId());
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, item.getUserId())
                .last("limit 1"));
        row.put("id", item.getId());
        row.put("userId", item.getUserId());
        row.put("username", user == null ? null : user.getUsername());
        row.put("nickname", profile == null ? null : profile.getNickname());
        row.put("type", item.getType());
        row.put("title", item.getTitle());
        row.put("content", item.getContent());
        row.put("isRead", item.getIsRead());
        row.put("relatedId", item.getRelatedId());
        row.put("relatedType", item.getRelatedType());
        row.put("createdAt", item.getCreatedAt());
        return row;
    }

    private Long resolveTargetUserId(SendPrivateMessageRequest request) {
        if (request.getToUserId() != null) {
            return request.getToUserId();
        }
        if (request.getToForumUid() != null) {
            SysUser byForumUid = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                    .eq(SysUser::getForumUid, request.getToForumUid())
                    .last("limit 1"));
            if (byForumUid != null) {
                return byForumUid.getId();
            }
        }
        if (StringUtils.isNotBlank(request.getToUsername())) {
            SysUser byUsername = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                    .eq(SysUser::getUsername, request.getToUsername().trim())
                    .last("limit 1"));
            if (byUsername != null) {
                return byUsername.getId();
            }
        }
        throw new BusinessException("目标用户不存在");
    }

    private Long resolveIdentifier(String identifier) {
        if (StringUtils.isBlank(identifier)) {
            throw new BusinessException("目标用户不存在");
        }
        String value = identifier.trim();
        if (value.matches("^\\d+$")) {
            Long numericValue = Long.parseLong(value);
            SysUser byId = sysUserMapper.selectById(numericValue);
            if (byId != null) {
                return byId.getId();
            }
            SysUser byForumUid = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                    .eq(SysUser::getForumUid, numericValue)
                    .last("limit 1"));
            if (byForumUid != null) {
                return byForumUid.getId();
            }
        }
        SysUser byUsername = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, value)
                .last("limit 1"));
        if (byUsername != null) {
            return byUsername.getId();
        }
        throw new BusinessException("目标用户不存在");
    }
}
