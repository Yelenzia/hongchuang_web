package com.hongchuang.platform.modules.achievement.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.modules.achievement.dto.AchievementSaveRequest;
import com.hongchuang.platform.modules.achievement.entity.ForumAchievement;
import com.hongchuang.platform.modules.achievement.entity.ForumUserAchievement;
import com.hongchuang.platform.modules.achievement.mapper.ForumAchievementMapper;
import com.hongchuang.platform.modules.achievement.mapper.ForumUserAchievementMapper;
import com.hongchuang.platform.modules.achievement.vo.AchievementVO;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final ForumAchievementMapper forumAchievementMapper;
    private final ForumUserAchievementMapper forumUserAchievementMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final SysUserMapper sysUserMapper;

    public List<AchievementVO> listAllWithUserState(Long userId) {
        List<ForumAchievement> achievements = forumAchievementMapper.selectList(new LambdaQueryWrapper<ForumAchievement>()
                .eq(ForumAchievement::getStatus, 1)
                .orderByAsc(ForumAchievement::getSortOrder)
                .orderByAsc(ForumAchievement::getId));
        Map<Long, ForumUserAchievement> obtainedMap = forumUserAchievementMapper.selectList(new LambdaQueryWrapper<ForumUserAchievement>()
                        .eq(ForumUserAchievement::getUserId, userId))
                .stream().collect(Collectors.toMap(ForumUserAchievement::getAchievementId, Function.identity(), (a,b)->a));
        return achievements.stream().map(item -> AchievementVO.builder()
                .id(item.getId())
                .code(item.getCode())
                .name(item.getName())
                .description(item.getDescription())
                .icon(item.getIcon())
                .color(item.getColor())
                .obtained(obtainedMap.containsKey(item.getId()))
                .obtainedAt(obtainedMap.containsKey(item.getId()) ? obtainedMap.get(item.getId()).getObtainedAt() : null)
                .build()).toList();
    }

    public List<AchievementVO> listUserAchievements(Long userId) {
        List<ForumUserAchievement> relations = forumUserAchievementMapper.selectList(new LambdaQueryWrapper<ForumUserAchievement>()
                .eq(ForumUserAchievement::getUserId, userId));
        if (relations.isEmpty()) {
            return List.of();
        }
        Set<Long> ids = relations.stream().map(ForumUserAchievement::getAchievementId).collect(Collectors.toSet());
        Map<Long, ForumAchievement> achievementMap = forumAchievementMapper.selectList(new LambdaQueryWrapper<ForumAchievement>()
                        .in(ForumAchievement::getId, ids))
                .stream().collect(Collectors.toMap(ForumAchievement::getId, Function.identity()));
        return relations.stream()
                .sorted(Comparator.comparing(ForumUserAchievement::getObtainedAt).reversed())
                .map(rel -> {
                    ForumAchievement item = achievementMap.get(rel.getAchievementId());
                    if (item == null) return null;
                    return AchievementVO.builder()
                            .id(item.getId())
                            .code(item.getCode())
                            .name(item.getName())
                            .description(item.getDescription())
                            .icon(item.getIcon())
                            .color(item.getColor())
                            .obtainedAt(rel.getObtainedAt())
                            .obtained(true)
                            .build();
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    public Integer countUserAchievements(Long userId) {
        Long count = forumUserAchievementMapper.selectCount(new LambdaQueryWrapper<ForumUserAchievement>()
                .eq(ForumUserAchievement::getUserId, userId));
        return count == null ? 0 : count.intValue();
    }

    @Transactional(rollbackFor = Exception.class)
    public void awardByCode(Long userId, String code) {
        ForumAchievement achievement = findAchievementByCode(code);
        if (achievement == null) {
            return;
        }
        long exists = forumUserAchievementMapper.selectCount(new LambdaQueryWrapper<ForumUserAchievement>()
                .eq(ForumUserAchievement::getUserId, userId)
                .eq(ForumUserAchievement::getAchievementId, achievement.getId()));
        if (exists > 0) {
            return;
        }
        ForumUserAchievement relation = new ForumUserAchievement();
        relation.setUserId(userId);
        relation.setAchievementId(achievement.getId());
        relation.setObtainedAt(LocalDateTime.now());
        forumUserAchievementMapper.insert(relation);
    }

    @Transactional(rollbackFor = Exception.class)
    public void awardForRegister(Long userId) {
        awardByCode(userId, "REGISTER");
        awardByCode(userId, "pioneer");
        SysUser user = sysUserMapper.selectById(userId);
        if (user != null && user.getForumUid() != null && user.getForumUid() <= 10020) {
            awardByCode(userId, "EARLY_BIRD");
            awardByCode(userId, "early_supporter");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void evaluateMilestones(Long userId) {
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId).last("limit 1"));
        if (profile == null) {
            return;
        }
        if (profile.getPostCount() != null && profile.getPostCount() >= 1) {
            awardByCode(userId, "FIRST_POST");
            awardByCode(userId, "first_post");
        }
        if (profile.getPostCount() != null && profile.getPostCount() >= 3) {
            awardByCode(userId, "POST_3");
            awardByCode(userId, "creator_lv1");
        }
        if (profile.getCommentCount() != null && profile.getCommentCount() >= 1) {
            awardByCode(userId, "FIRST_COMMENT");
            awardByCode(userId, "first_comment");
        }
        if (profile.getCommentCount() != null && profile.getCommentCount() >= 10) {
            awardByCode(userId, "COMMENT_10");
            awardByCode(userId, "communicator_lv1");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void save(Long id, AchievementSaveRequest request) {
        ForumAchievement item = id == null ? new ForumAchievement() : forumAchievementMapper.selectById(id);
        if (item == null) {
            throw new BusinessException("成就不存在");
        }
        item.setCode(request.getCode());
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setIcon(request.getIcon());
        item.setColor(request.getColor());
        item.setSortOrder(request.getSortOrder());
        item.setStatus(request.getStatus());
        if (id == null) {
            forumAchievementMapper.insert(item);
        } else {
            forumAchievementMapper.updateById(item);
        }
    }

    public List<ForumAchievement> adminList() {
        return forumAchievementMapper.selectList(new LambdaQueryWrapper<ForumAchievement>()
                .orderByAsc(ForumAchievement::getSortOrder)
                .orderByAsc(ForumAchievement::getId));
    }

    @Transactional(rollbackFor = Exception.class)
    public void bootstrapAndBackfill() {
        List<SysUser> users = sysUserMapper.selectList(new LambdaQueryWrapper<SysUser>().orderByAsc(SysUser::getCreatedAt));
        for (SysUser user : users) {
            awardForRegister(user.getId());
            evaluateMilestones(user.getId());
        }
    }

    private ForumAchievement findAchievementByCode(String code) {
        if (code == null) return null;
        String trimmed = code.trim();
        ForumAchievement found = forumAchievementMapper.selectOne(new LambdaQueryWrapper<ForumAchievement>()
                .eq(ForumAchievement::getCode, trimmed)
                .last("limit 1"));
        if (found != null) return found;
        found = forumAchievementMapper.selectOne(new LambdaQueryWrapper<ForumAchievement>()
                .eq(ForumAchievement::getCode, trimmed.toLowerCase(Locale.ROOT))
                .last("limit 1"));
        if (found != null) return found;
        return forumAchievementMapper.selectOne(new LambdaQueryWrapper<ForumAchievement>()
                .eq(ForumAchievement::getCode, trimmed.toUpperCase(Locale.ROOT))
                .last("limit 1"));
    }
}
