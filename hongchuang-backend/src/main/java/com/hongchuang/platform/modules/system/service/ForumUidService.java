package com.hongchuang.platform.modules.system.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.modules.system.entity.SysSequence;
import com.hongchuang.platform.modules.system.mapper.SysSequenceMapper;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ForumUidService {

    public static final String BIZ_KEY = "forum_uid";
    public static final long START_VALUE = 10000L;

    private final SysSequenceMapper sysSequenceMapper;
    private final SysUserMapper sysUserMapper;

    @Transactional(rollbackFor = Exception.class)
    public Long nextForumUid() {
        sysSequenceMapper.insertIgnore(BIZ_KEY, START_VALUE);
        SysSequence sequence = sysSequenceMapper.selectForUpdate(BIZ_KEY);
        long maxExisting = getMaxExistingForumUid();
        long current = Math.max(sequence == null || sequence.getLastValue() == null ? START_VALUE : sequence.getLastValue(), maxExisting);
        long candidate = current + 1;
        while (isReserved(candidate) || existsForumUid(candidate)) {
            candidate++;
        }
        sysSequenceMapper.updateLastValue(BIZ_KEY, candidate);
        return candidate;
    }

    @Transactional(rollbackFor = Exception.class)
    public void syncSequenceToMax() {
        sysSequenceMapper.insertIgnore(BIZ_KEY, START_VALUE);
        long maxExisting = getMaxExistingForumUid();
        SysSequence sequence = sysSequenceMapper.selectForUpdate(BIZ_KEY);
        long current = sequence == null || sequence.getLastValue() == null ? START_VALUE : sequence.getLastValue();
        if (maxExisting > current) {
            sysSequenceMapper.updateLastValue(BIZ_KEY, maxExisting);
        }
    }

    public boolean isReserved(long forumUid) {
        String value = String.valueOf(forumUid);
        if (value.length() < 5) {
            return true;
        }
        if (value.matches("(\\d)\\1{4,}")) {
            return true;
        }
        if (value.matches(".*(111|222|333|444|555|666|777|888|999)$")) {
            return true;
        }
        return forumUid == 10086L
                || forumUid == 10088L
                || forumUid == 10240L
                || forumUid == 13140L
                || forumUid == 52131L
                || forumUid == 66666L
                || forumUid == 88888L
                || forumUid == 99999L;
    }

    private long getMaxExistingForumUid() {
        SysUser maxUser = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                .select(SysUser::getForumUid)
                .isNotNull(SysUser::getForumUid)
                .orderByDesc(SysUser::getForumUid)
                .last("limit 1"));
        return maxUser == null || maxUser.getForumUid() == null ? START_VALUE : maxUser.getForumUid();
    }

    private boolean existsForumUid(long forumUid) {
        return sysUserMapper.selectCount(new LambdaQueryWrapper<SysUser>().eq(SysUser::getForumUid, forumUid)) > 0;
    }
}
