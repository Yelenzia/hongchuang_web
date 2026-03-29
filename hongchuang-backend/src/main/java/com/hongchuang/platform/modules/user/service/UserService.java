package com.hongchuang.platform.modules.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.achievement.service.AchievementService;
import com.hongchuang.platform.modules.social.entity.UserFollow;
import com.hongchuang.platform.modules.social.mapper.UserFollowMapper;
import com.hongchuang.platform.modules.auth.service.AuthService;
import com.hongchuang.platform.modules.user.dto.CancelAccountRequest;
import com.hongchuang.platform.modules.user.dto.ChangePasswordRequest;
import com.hongchuang.platform.modules.user.dto.UpdateProfileRequest;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import com.hongchuang.platform.modules.user.vo.CurrentUserVO;
import com.hongchuang.platform.modules.user.vo.PublicUserProfileVO;
import com.hongchuang.platform.modules.user.vo.UserSearchVO;
import com.hongchuang.platform.modules.verification.service.VerificationService;
import com.hongchuang.platform.modules.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final PasswordEncoder passwordEncoder;
    private final AchievementService achievementService;
    private final VerificationService verificationService;
    private final WalletService walletService;
    private final UserFollowMapper userFollowMapper;
    private final AuthService authService;

    public CurrentUserVO getCurrentUser() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        SysUserProfile profile = getProfile(userId);
        int exp = profile == null || profile.getExperiencePoints() == null ? 0 : profile.getExperiencePoints();
        return CurrentUserVO.builder()
                .id(user.getId())
                .forumUid(user.getForumUid())
                .username(user.getUsername())
                .nickname(profile == null ? user.getUsername() : profile.getNickname())
                .email(user.getEmail())
                .avatarUrl(profile == null ? null : profile.getAvatarUrl())
                .signature(profile == null ? null : profile.getSignature())
                .businessCard(profile == null ? null : profile.getBusinessCard())
                .userLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                .experiencePoints(exp)
                .nextLevelExp(WalletService.nextLevelExp(exp))
                .bio(profile == null ? null : profile.getBio())
                .role(user.getRole())
                .registerTime(user.getCreatedAt())
                .postCount(profile == null || profile.getPostCount() == null ? 0 : profile.getPostCount())
                .commentCount(profile == null || profile.getCommentCount() == null ? 0 : profile.getCommentCount())
                .favoriteCount(profile == null || profile.getFavoriteCount() == null ? 0 : profile.getFavoriteCount())
                .followingCount(profile == null || profile.getFollowingCount() == null ? 0 : profile.getFollowingCount())
                .followerCount(profile == null || profile.getFollowerCount() == null ? 0 : profile.getFollowerCount())
                .followedByCurrentUser(false)
                .achievementCount(achievementService.countUserAchievements(userId))
                .build();
    }

    public PublicUserProfileVO getPublicProfile(Long userId) {
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null || (user.getDeleted() != null && user.getDeleted() == 1)) {
            throw new BusinessException("用户不存在");
        }
        SysUserProfile profile = getProfile(userId);
        int exp = profile == null || profile.getExperiencePoints() == null ? 0 : profile.getExperiencePoints();
        Long currentUserId = CurrentUserUtils.getCurrentUserId();
        boolean followed = currentUserId != null && !currentUserId.equals(userId) && userFollowMapper.selectCount(new LambdaQueryWrapper<UserFollow>()
                .eq(UserFollow::getFollowerUserId, currentUserId)
                .eq(UserFollow::getFolloweeUserId, userId)) > 0;
        return PublicUserProfileVO.builder()
                .userId(user.getId())
                .forumUid(user.getForumUid())
                .username(user.getUsername())
                .nickname(profile == null ? user.getUsername() : profile.getNickname())
                .avatarUrl(profile == null ? null : profile.getAvatarUrl())
                .signature(profile == null ? null : profile.getSignature())
                .businessCard(profile == null ? null : profile.getBusinessCard())
                .userLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                .experiencePoints(exp)
                .nextLevelExp(WalletService.nextLevelExp(exp))
                .bio(profile == null ? null : profile.getBio())
                .registerTime(user.getCreatedAt())
                .postCount(profile == null || profile.getPostCount() == null ? 0 : profile.getPostCount())
                .commentCount(profile == null || profile.getCommentCount() == null ? 0 : profile.getCommentCount())
                .favoriteCount(profile == null || profile.getFavoriteCount() == null ? 0 : profile.getFavoriteCount())
                .followingCount(profile == null || profile.getFollowingCount() == null ? 0 : profile.getFollowingCount())
                .followerCount(profile == null || profile.getFollowerCount() == null ? 0 : profile.getFollowerCount())
                .followedByCurrentUser(followed)
                .achievementCount(achievementService.countUserAchievements(userId))
                .build();
    }

    public List<UserSearchVO> searchUsers(String keyword, Integer limit) {
        String trimmedKeyword = StringUtils.trimToEmpty(keyword);
        if (trimmedKeyword.length() < 1) {
            return List.of();
        }
        int size = limit == null || limit <= 0 ? 10 : Math.min(limit, 20);

        Set<Long> userIds = new LinkedHashSet<>();
        sysUserMapper.selectList(new LambdaQueryWrapper<SysUser>()
                        .select(SysUser::getId)
                        .eq(SysUser::getStatus, 1)
                        .and(w -> w.like(SysUser::getUsername, trimmedKeyword).or().like(SysUser::getEmail, trimmedKeyword))
                        .last("limit " + size))
                .forEach(item -> userIds.add(item.getId()));
        if (userIds.size() < size) {
            sysUserProfileMapper.selectList(new LambdaQueryWrapper<SysUserProfile>()
                            .select(SysUserProfile::getUserId)
                            .like(SysUserProfile::getNickname, trimmedKeyword)
                            .last("limit " + size))
                    .forEach(item -> userIds.add(item.getUserId()));
        }
        if (userIds.isEmpty()) {
            return List.of();
        }

        List<Long> limitedIds = new ArrayList<>(userIds).subList(0, Math.min(userIds.size(), size));
        List<SysUser> users = sysUserMapper.selectBatchIds(limitedIds);
        List<SysUserProfile> profiles = sysUserProfileMapper.selectList(new LambdaQueryWrapper<SysUserProfile>()
                .in(SysUserProfile::getUserId, limitedIds));

        return limitedIds.stream().map(userId -> {
            SysUser user = users.stream().filter(item -> item.getId().equals(userId)).findFirst().orElse(null);
            if (user == null) {
                return null;
            }
            SysUserProfile profile = profiles.stream().filter(item -> item.getUserId().equals(userId)).findFirst().orElse(null);
            return UserSearchVO.builder()
                    .userId(user.getId())
                    .forumUid(user.getForumUid())
                    .username(user.getUsername())
                    .nickname(profile == null || StringUtils.isBlank(profile.getNickname()) ? user.getUsername() : profile.getNickname())
                    .avatarUrl(profile == null ? null : profile.getAvatarUrl())
                    .signature(profile == null ? null : profile.getSignature())
                    .userLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                    .build();
        }).filter(java.util.Objects::nonNull).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateProfile(UpdateProfileRequest request) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        SysUserProfile profile = getProfile(userId);
        if (profile == null) {
            throw new BusinessException("用户资料不存在");
        }
        profile.setNickname(SanitizeUtils.cleanText(request.getNickname()));
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setSignature(SanitizeUtils.cleanText(request.getSignature()));
        profile.setBio(SanitizeUtils.cleanText(request.getBio()));
        sysUserProfileMapper.updateById(profile);
    }

    public void changePassword(ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次输入的新密码不一致");
        }
        Long userId = CurrentUserUtils.getCurrentUserId();
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        verificationService.validateEmailCode("CHANGE_PASSWORD", user.getEmail(), request.getEmailCode());
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BusinessException("旧密码错误");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        sysUserMapper.updateById(user);
    }


    @Transactional(rollbackFor = Exception.class)
    public void cancelAccount(CancelAccountRequest request, String authorization) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null || (user.getDeleted() != null && user.getDeleted() == 1)) {
            throw new BusinessException("用户不存在");
        }
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        verificationService.validateEmailCode("CANCEL_ACCOUNT", user.getEmail(), request.getEmailCode());
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("当前密码错误");
        }

        String suffix = String.valueOf(user.getId());
        user.setUsername("cancelled_" + suffix);
        user.setEmail("cancelled_" + suffix + "@invalid.local");
        user.setPasswordHash(passwordEncoder.encode("cancelled-" + suffix + "-" + System.currentTimeMillis()));
        user.setStatus(0);
        user.setEmailVerified(0);
        user.setDeleted(1);
        sysUserMapper.updateById(user);

        SysUserProfile profile = getProfile(userId);
        if (profile != null) {
            profile.setNickname("已注销用户");
            profile.setAvatarUrl(null);
            profile.setSignature("该账号已注销");
            profile.setBio(StringUtils.abbreviate(StringUtils.defaultIfBlank(request.getReason(), "用户主动注销账号"), 120));
            profile.setBusinessCard(null);
            sysUserProfileMapper.updateById(profile);
        }

        if (StringUtils.isNotBlank(authorization) && authorization.startsWith("Bearer ")) {
            authService.logout(authorization.substring(7));
        }
    }

    public void incrementPostCount(Long userId, int delta) {
        sysUserProfileMapper.update(null, new LambdaUpdateWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId)
                .setSql("post_count = GREATEST(post_count + " + delta + ", 0)"));
    }

    public void incrementCommentCount(Long userId, int delta) {
        sysUserProfileMapper.update(null, new LambdaUpdateWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId)
                .setSql("comment_count = GREATEST(comment_count + " + delta + ", 0)"));
    }

    public void addExperience(Long userId, int delta) {
        walletService.addExperience(userId, delta);
    }

    private SysUserProfile getProfile(Long userId) {
        return sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId).last("limit 1"));
    }
}
