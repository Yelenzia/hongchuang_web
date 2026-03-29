package com.hongchuang.platform.modules.announcement.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.announcement.dto.AnnouncementSaveRequest;
import com.hongchuang.platform.modules.announcement.entity.CmsAnnouncement;
import com.hongchuang.platform.modules.announcement.mapper.CmsAnnouncementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final CmsAnnouncementMapper cmsAnnouncementMapper;

    public List<CmsAnnouncement> latest() {
        return cmsAnnouncementMapper.selectList(new LambdaQueryWrapper<CmsAnnouncement>()
                .eq(CmsAnnouncement::getPublishStatus, 2)
                .orderByDesc(CmsAnnouncement::getIsPinned)
                .orderByDesc(CmsAnnouncement::getPublishedAt)
                .last("limit 5"));
    }

    public Page<CmsAnnouncement> pagePublished(long pageNo, long pageSize) {
        return cmsAnnouncementMapper.selectPage(Page.of(pageNo, pageSize), new LambdaQueryWrapper<CmsAnnouncement>()
                .eq(CmsAnnouncement::getPublishStatus, 2)
                .orderByDesc(CmsAnnouncement::getIsPinned)
                .orderByDesc(CmsAnnouncement::getPublishedAt));
    }

    public CmsAnnouncement detailPublished(Long id) {
        CmsAnnouncement announcement = cmsAnnouncementMapper.selectById(id);
        if (announcement == null || announcement.getPublishStatus() == null || announcement.getPublishStatus() != 2) {
            throw new BusinessException("公告不存在");
        }
        return announcement;
    }

    public Page<CmsAnnouncement> pageAdmin(long pageNo, long pageSize) {
        return cmsAnnouncementMapper.selectPage(Page.of(pageNo, pageSize), new LambdaQueryWrapper<CmsAnnouncement>()
                .orderByDesc(CmsAnnouncement::getCreatedAt));
    }

    public Long create(AnnouncementSaveRequest request) {
        CmsAnnouncement announcement = new CmsAnnouncement();
        announcement.setTitle(SanitizeUtils.cleanText(request.getTitle()));
        announcement.setSummary(SanitizeUtils.cleanText(request.getSummary()));
        announcement.setContent(SanitizeUtils.cleanHtml(request.getContent()));
        announcement.setIsPinned(request.getIsPinned() == null ? 0 : request.getIsPinned());
        announcement.setPublishStatus(request.getPublishStatus() == null ? 1 : request.getPublishStatus());
        announcement.setPublishedAt(announcement.getPublishStatus() == 2 ? LocalDateTime.now() : null);
        announcement.setCreatedBy(CurrentUserUtils.getCurrentUserId());
        announcement.setUpdatedBy(CurrentUserUtils.getCurrentUserId());
        cmsAnnouncementMapper.insert(announcement);
        return announcement.getId();
    }

    public void update(Long id, AnnouncementSaveRequest request) {
        CmsAnnouncement announcement = cmsAnnouncementMapper.selectById(id);
        if (announcement == null) {
            throw new BusinessException("公告不存在");
        }
        announcement.setTitle(SanitizeUtils.cleanText(request.getTitle()));
        announcement.setSummary(SanitizeUtils.cleanText(request.getSummary()));
        announcement.setContent(SanitizeUtils.cleanHtml(request.getContent()));
        announcement.setIsPinned(request.getIsPinned());
        announcement.setPublishStatus(request.getPublishStatus());
        if (request.getPublishStatus() != null && request.getPublishStatus() == 2 && announcement.getPublishedAt() == null) {
            announcement.setPublishedAt(LocalDateTime.now());
        }
        announcement.setUpdatedBy(CurrentUserUtils.getCurrentUserId());
        cmsAnnouncementMapper.updateById(announcement);
    }

    public void delete(Long id) {
        cmsAnnouncementMapper.deleteById(id);
    }
}
