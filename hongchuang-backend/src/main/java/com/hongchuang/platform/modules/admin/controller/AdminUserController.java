package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.modules.achievement.service.AchievementService;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final PasswordEncoder passwordEncoder;
    private final AchievementService achievementService;
    private final NotificationService notificationService;

    public AdminUserController(SysUserMapper sysUserMapper, SysUserProfileMapper sysUserProfileMapper, PasswordEncoder passwordEncoder, AchievementService achievementService, NotificationService notificationService) {
        this.sysUserMapper = sysUserMapper;
        this.sysUserProfileMapper = sysUserProfileMapper;
        this.passwordEncoder = passwordEncoder;
        this.achievementService = achievementService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public Result<Page<Map<String, Object>>> page(@RequestParam(defaultValue = "1") long pageNo,
                                                  @RequestParam(defaultValue = "10") long pageSize,
                                                  @RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) Integer status) {
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(keyword)) {
            wrapper.and(w -> w.like(SysUser::getUsername, keyword).or().like(SysUser::getEmail, keyword));
        }
        if (status != null) {
            wrapper.eq(SysUser::getStatus, status);
        }
        wrapper.orderByDesc(SysUser::getCreatedAt);
        Page<SysUser> page = sysUserMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
        Page<Map<String, Object>> result = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        result.setRecords(page.getRecords().stream().map(this::toMap).toList());
        return Result.success(result);
    }

    @GetMapping("/{userId}")
    public Result<Map<String, Object>> detail(@PathVariable Long userId) {
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return Result.success(toMap(user));
    }

    @PatchMapping("/{userId}/ban")
    public Result<Void> ban(@PathVariable Long userId) {
        SysUser user = requireUser(userId);
        user.setStatus(2);
        sysUserMapper.updateById(user);
        notificationService.push(userId, "SYSTEM_BAN", "账号已封禁", "你的账号已被管理员封禁，如有疑问请联系技术部。", userId, "USER");
        return Result.success("封禁成功", null);
    }

    @PatchMapping("/{userId}/unban")
    public Result<Void> unban(@PathVariable Long userId) {
        SysUser user = requireUser(userId);
        user.setStatus(1);
        sysUserMapper.updateById(user);
        notificationService.push(userId, "SYSTEM_UNBAN", "账号已解封", "你的账号已恢复正常使用。", userId, "USER");
        return Result.success("解封成功", null);
    }

    @PatchMapping("/{userId}/role")
    public Result<Void> updateRole(@PathVariable Long userId, @RequestBody UpdateUserRoleRequest request) {
        SysUser user = requireUser(userId);
        if (!"USER".equals(request.getRole()) && !"ADMIN".equals(request.getRole())) {
            throw new BusinessException("角色不合法");
        }
        user.setRole(request.getRole());
        sysUserMapper.updateById(user);
        return Result.success("角色已更新", null);
    }

    @PatchMapping("/{userId}/identity")
    public Result<Void> updateIdentity(@PathVariable Long userId, @RequestBody UpdateIdentityRequest request) {
        requireUser(userId);
        SysUserProfile profile = getOrCreateProfile(userId);
        profile.setBusinessCard(request.getBusinessCard());
        profile.setUserLevel(request.getUserLevel() == null ? 1 : Math.max(1, Math.min(9, request.getUserLevel())));
        sysUserProfileMapper.updateById(profile);
        return Result.success("名片与等级已更新", null);
    }

    @PatchMapping("/{userId}/password")
    public Result<Void> resetPassword(@PathVariable Long userId, @RequestBody ResetPasswordRequest request) {
        if (StringUtils.isBlank(request.getNewPassword()) || request.getNewPassword().length() < 8) {
            throw new BusinessException("新密码长度不能少于8位");
        }
        SysUser user = requireUser(userId);
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        sysUserMapper.updateById(user);
        return Result.success("密码已重置", null);
    }

    @PatchMapping("/{userId}/warn")
    public Result<Void> warn(@PathVariable Long userId, @RequestBody WarningRequest request) {
        requireUser(userId);
        notificationService.push(userId, "SYSTEM_WARNING", "系统警告", request.getContent() == null || request.getContent().isBlank() ? "你的账号收到一条系统警告，请注意社区规范。" : request.getContent(), userId, "USER");
        return Result.success("警告已发送", null);
    }

    private SysUser requireUser(Long userId) {
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null) throw new BusinessException("用户不存在");
        return user;
    }

    private SysUserProfile getOrCreateProfile(Long userId) {
        SysUser user = requireUser(userId);
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>().eq(SysUserProfile::getUserId, userId).last("limit 1"));
        if (profile != null) return profile;
        profile = new SysUserProfile();
        profile.setUserId(userId);
        profile.setNickname(user.getUsername());
        profile.setUserLevel(1);
        profile.setExperiencePoints(0);
        profile.setPostCount(0);
        profile.setCommentCount(0);
        profile.setFavoriteCount(0);
        profile.setFollowingCount(0);
        profile.setFollowerCount(0);
        profile.setLikeReceivedCount(0);
        sysUserProfileMapper.insert(profile);
        return profile;
    }

    private Map<String, Object> toMap(SysUser user) {
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, user.getId()).last("limit 1"));
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("forumUid", user.getForumUid());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("status", user.getStatus());
        map.put("emailVerified", user.getEmailVerified());
        map.put("registerTime", user.getCreatedAt());
        map.put("lastLoginAt", user.getLastLoginAt());
        map.put("postCount", profile == null || profile.getPostCount() == null ? 0 : profile.getPostCount());
        map.put("commentCount", profile == null || profile.getCommentCount() == null ? 0 : profile.getCommentCount());
        map.put("favoriteCount", profile == null || profile.getFavoriteCount() == null ? 0 : profile.getFavoriteCount());
        map.put("followingCount", profile == null || profile.getFollowingCount() == null ? 0 : profile.getFollowingCount());
        map.put("followerCount", profile == null || profile.getFollowerCount() == null ? 0 : profile.getFollowerCount());
        map.put("nickname", profile == null ? user.getUsername() : profile.getNickname());
        map.put("avatarUrl", profile == null ? null : profile.getAvatarUrl());
        map.put("signature", profile == null ? null : profile.getSignature());
        map.put("businessCard", profile == null ? null : profile.getBusinessCard());
        map.put("userLevel", profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel());
        map.put("bio", profile == null ? null : profile.getBio());
        map.put("experiencePoints", profile == null ? 0 : (profile.getExperiencePoints() == null ? 0 : profile.getExperiencePoints()));
        map.put("achievementCount", achievementService.countUserAchievements(user.getId()));
        return map;
    }

    @Data
    public static class UpdateUserRoleRequest {
        private String role;
    }

    @Data
    public static class UpdateIdentityRequest {
        private String businessCard;
        private Integer userLevel;
    }

    @Data
    public static class ResetPasswordRequest {
        private String newPassword;
    }

    @Data
    public static class WarningRequest {
        private String content;
    }
}
