package com.hongchuang.platform.modules.tag.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.modules.tag.dto.TagSaveRequest;
import com.hongchuang.platform.modules.tag.entity.ForumTag;
import com.hongchuang.platform.modules.tag.mapper.ForumTagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final ForumTagMapper forumTagMapper;

    public List<ForumTag> listAllEnabled() {
        return forumTagMapper.selectList(new LambdaQueryWrapper<ForumTag>()
                .eq(ForumTag::getStatus, 1)
                .orderByDesc(ForumTag::getPostCount)
                .orderByAsc(ForumTag::getName));
    }

    public List<ForumTag> listAll() {
        return forumTagMapper.selectList(new LambdaQueryWrapper<ForumTag>()
                .orderByDesc(ForumTag::getPostCount)
                .orderByAsc(ForumTag::getName));
    }

    public List<ForumTag> listHot() {
        return forumTagMapper.selectList(new LambdaQueryWrapper<ForumTag>()
                .eq(ForumTag::getStatus, 1)
                .orderByDesc(ForumTag::getPostCount)
                .last("limit 12"));
    }

    public ForumTag getById(Long tagId) {
        ForumTag tag = forumTagMapper.selectById(tagId);
        if (tag == null) {
            throw new BusinessException("标签不存在");
        }
        return tag;
    }

    public List<ForumTag> listByIds(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return List.of();
        }
        return forumTagMapper.selectBatchIds(tagIds);
    }

    public Long create(TagSaveRequest request) {
        if (forumTagMapper.selectCount(new LambdaQueryWrapper<ForumTag>().eq(ForumTag::getName, request.getName())) > 0) {
            throw new BusinessException("标签已存在");
        }
        ForumTag tag = new ForumTag();
        tag.setName(request.getName());
        tag.setSlug(request.getSlug());
        tag.setPostCount(0);
        tag.setStatus(request.getStatus() == null ? 1 : request.getStatus());
        forumTagMapper.insert(tag);
        return tag.getId();
    }

    public void update(Long tagId, TagSaveRequest request) {
        ForumTag tag = getById(tagId);
        tag.setName(request.getName());
        tag.setSlug(request.getSlug());
        tag.setStatus(request.getStatus());
        forumTagMapper.updateById(tag);
    }

    public void delete(Long tagId) {
        forumTagMapper.deleteById(tagId);
    }

    public void incrementPostCount(Long tagId, int delta) {
        ForumTag tag = forumTagMapper.selectById(tagId);
        if (tag == null) {
            return;
        }
        tag.setPostCount(Math.max((tag.getPostCount() == null ? 0 : tag.getPostCount()) + delta, 0));
        forumTagMapper.updateById(tag);
    }
}
