package com.hongchuang.platform.modules.system.bootstrap;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.config.properties.AdminBootstrapProperties;
import com.hongchuang.platform.modules.achievement.service.AchievementService;
import com.hongchuang.platform.modules.system.service.ForumUidService;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SystemBootstrapRunner {

    private final AdminBootstrapProperties adminBootstrapProperties;
    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final PasswordEncoder passwordEncoder;
    private final ForumUidService forumUidService;
    private final AchievementService achievementService;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional(rollbackFor = Exception.class)
    public void init() {
        backfillForumUid();
        forumUidService.syncSequenceToMax();
        bootstrapAdminIfNeeded();
        achievementService.bootstrapAndBackfill();
    }

    private void backfillForumUid() {
        List<SysUser> users = sysUserMapper.selectList(new LambdaQueryWrapper<SysUser>()
                .isNull(SysUser::getForumUid)
                .orderByAsc(SysUser::getCreatedAt)
                .orderByAsc(SysUser::getId));
        if (users.isEmpty()) {
            return;
        }
        for (SysUser user : users) {
            user.setForumUid(forumUidService.nextForumUid());
            sysUserMapper.updateById(user);
        }
        log.info("Backfilled forumUid for {} user(s).", users.size());
    }

    private void bootstrapAdminIfNeeded() {
        if (!adminBootstrapProperties.isEnabled()) {
            return;
        }
        SysUser exists = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, adminBootstrapProperties.getUsername())
                .last("limit 1"));
        if (exists != null) {
            if (!"ADMIN".equalsIgnoreCase(exists.getRole())) {
                exists.setRole("ADMIN");
                sysUserMapper.updateById(exists);
                log.info("Promoted existing user [{}] to ADMIN.", exists.getUsername());
            }
            return;
        }

        SysUser user = new SysUser();
        user.setUsername(adminBootstrapProperties.getUsername());
        user.setEmail(adminBootstrapProperties.getEmail());
        user.setPasswordHash(passwordEncoder.encode(adminBootstrapProperties.getPassword()));
        user.setRole("ADMIN");
        user.setStatus(1);
        user.setEmailVerified(1);
        user.setForumUid(forumUidService.nextForumUid());
        sysUserMapper.insert(user);

        SysUserProfile profile = new SysUserProfile();
        profile.setUserId(user.getId());
        profile.setNickname(adminBootstrapProperties.getNickname());
        profile.setSignature("管理后台巡逻中，随时准备处理社区事务。");
        profile.setBusinessCard("BOSS");
        profile.setUserLevel(9);
        profile.setBio("默认管理员账号（开发环境自动创建）");
        profile.setPostCount(0);
        profile.setCommentCount(0);
        profile.setFavoriteCount(0);
        profile.setFollowingCount(0);
        profile.setFollowerCount(0);
        profile.setLikeReceivedCount(0);
        sysUserProfileMapper.insert(profile);
        achievementService.awardForRegister(user.getId());

        log.info("Bootstrapped default admin account. username={}, password={}",
                adminBootstrapProperties.getUsername(),
                adminBootstrapProperties.getPassword());
    }
}
