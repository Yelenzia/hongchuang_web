package com.hongchuang.platform.modules.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.content.dto.DraftSaveRequest;
import com.hongchuang.platform.modules.content.entity.ContentDraft;
import com.hongchuang.platform.modules.content.mapper.ContentDraftMapper;
import com.hongchuang.platform.modules.content.vo.ContentDraftVO;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContentDraftService {

    private final ContentDraftMapper contentDraftMapper;
    private final ObjectMapper objectMapper;

    @Transactional(rollbackFor = Exception.class)
    public Long save(DraftSaveRequest request) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        ContentDraft draft = request.getId() == null ? new ContentDraft() : requireOwnedDraft(request.getId(), userId);
        draft.setDraftType(StringUtils.upperCase(StringUtils.trimToEmpty(request.getDraftType())));
        draft.setSceneCode(StringUtils.upperCase(StringUtils.trimToEmpty(request.getSceneCode())));
        draft.setOwnerUserId(userId);
        draft.setTitle(SanitizeUtils.cleanText(request.getTitle()));
        draft.setSummary(SanitizeUtils.cleanText(request.getSummary()));
        draft.setContentMarkdown(request.getContentMarkdown());
        draft.setExtraJson(toJson(request.getExtraData()));
        draft.setStatus(0);
        draft.setAutoSaved(Boolean.TRUE.equals(request.getAutoSaved()) ? 1 : 0);
        if (draft.getDeleted() == null) {
            draft.setDeleted(0);
        }
        if (request.getId() == null) {
            contentDraftMapper.insert(draft);
        } else {
            contentDraftMapper.updateById(draft);
        }
        return draft.getId();
    }

    public PageResult<ContentDraftVO> myDrafts(long pageNo, long pageSize, String draftType) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        LambdaQueryWrapper<ContentDraft> wrapper = new LambdaQueryWrapper<ContentDraft>()
                .eq(ContentDraft::getOwnerUserId, userId)
                .eq(ContentDraft::getDeleted, 0)
                .orderByDesc(ContentDraft::getUpdatedAt);
        if (StringUtils.isNotBlank(draftType)) {
            wrapper.eq(ContentDraft::getDraftType, StringUtils.upperCase(draftType.trim()));
        }
        Page<ContentDraft> page = contentDraftMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
        return PageResult.<ContentDraftVO>builder()
                .list(page.getRecords().stream().map(this::toVO).toList())
                .total(page.getTotal())
                .pageNo(page.getCurrent())
                .pageSize(page.getSize())
                .build();
    }

    public ContentDraftVO detail(Long draftId) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        return toVO(requireOwnedDraft(draftId, userId));
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Long draftId) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        ContentDraft draft = requireOwnedDraft(draftId, userId);
        draft.setDeleted(1);
        draft.setUpdatedAt(LocalDateTime.now());
        contentDraftMapper.updateById(draft);
    }

    public Page<ContentDraft> pageAdmin(long pageNo, long pageSize, String draftType, Long ownerUserId, String keyword) {
        LambdaQueryWrapper<ContentDraft> wrapper = new LambdaQueryWrapper<ContentDraft>()
                .eq(ContentDraft::getDeleted, 0);
        if (StringUtils.isNotBlank(draftType)) {
            wrapper.eq(ContentDraft::getDraftType, StringUtils.upperCase(draftType.trim()));
        }
        if (ownerUserId != null) {
            wrapper.eq(ContentDraft::getOwnerUserId, ownerUserId);
        }
        if (StringUtils.isNotBlank(keyword)) {
            wrapper.and(w -> w.like(ContentDraft::getTitle, keyword)
                    .or().like(ContentDraft::getSummary, keyword)
                    .or().like(ContentDraft::getContentMarkdown, keyword));
        }
        wrapper.orderByDesc(ContentDraft::getUpdatedAt);
        return contentDraftMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
    }

    @Transactional(rollbackFor = Exception.class)
    public void adminDelete(Long draftId) {
        ContentDraft draft = contentDraftMapper.selectById(draftId);
        if (draft == null || (draft.getDeleted() != null && draft.getDeleted() == 1)) {
            throw new BusinessException("草稿不存在");
        }
        draft.setDeleted(1);
        contentDraftMapper.updateById(draft);
    }

    private ContentDraft requireOwnedDraft(Long draftId, Long userId) {
        ContentDraft draft = contentDraftMapper.selectById(draftId);
        if (draft == null || (draft.getDeleted() != null && draft.getDeleted() == 1)) {
            throw new BusinessException("草稿不存在");
        }
        if (!draft.getOwnerUserId().equals(userId)) {
            throw new BusinessException(403, "无权访问该草稿");
        }
        return draft;
    }

    private ContentDraftVO toVO(ContentDraft draft) {
        return ContentDraftVO.builder()
                .id(draft.getId())
                .draftType(draft.getDraftType())
                .sceneCode(draft.getSceneCode())
                .ownerUserId(draft.getOwnerUserId())
                .title(draft.getTitle())
                .summary(draft.getSummary())
                .contentMarkdown(draft.getContentMarkdown())
                .extraData(parseJson(draft.getExtraJson()))
                .status(draft.getStatus())
                .autoSaved(draft.getAutoSaved())
                .createdAt(draft.getCreatedAt())
                .updatedAt(draft.getUpdatedAt())
                .build();
    }

    private String toJson(Map<String, Object> extraData) {
        if (extraData == null || extraData.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(extraData);
        } catch (Exception e) {
            throw new BusinessException("草稿扩展数据格式错误");
        }
    }

    private Map<String, Object> parseJson(String value) {
        if (StringUtils.isBlank(value)) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(value, new TypeReference<>() {});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }
}
