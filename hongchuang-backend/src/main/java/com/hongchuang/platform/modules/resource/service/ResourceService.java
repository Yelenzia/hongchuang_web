package com.hongchuang.platform.modules.resource.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import com.hongchuang.platform.modules.resource.dto.CreateResourceCommentRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceAuditRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceQueryRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceSaveRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceVersionSaveRequest;
import com.hongchuang.platform.modules.resource.entity.*;
import com.hongchuang.platform.modules.resource.mapper.*;
import com.hongchuang.platform.modules.resource.vo.*;
import com.hongchuang.platform.modules.tag.entity.ForumTag;
import com.hongchuang.platform.modules.tag.service.TagService;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import com.hongchuang.platform.modules.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private static final Pattern MENTION_PATTERN = Pattern.compile("@([A-Za-z0-9_\\-\\u4e00-\\u9fa5]{2,32})");
    private static final int STATUS_DRAFT = 0;
    private static final int STATUS_PENDING = 1;
    private static final int STATUS_PUBLISHED = 2;
    private static final int STATUS_OFFLINE = 3;
    private static final int STATUS_DELETED = 4;

    private final ResourceCategoryMapper resourceCategoryMapper;
    private final ResourceItemMapper resourceItemMapper;
    private final ResourceVersionMapper resourceVersionMapper;
    private final ResourceTagRelMapper resourceTagRelMapper;
    private final ResourceFavoriteMapper resourceFavoriteMapper;
    private final ResourceLikeMapper resourceLikeMapper;
    private final ResourceCommentMapper resourceCommentMapper;
    private final ResourceDownloadLogMapper resourceDownloadLogMapper;
    private final ResourceCategoryService resourceCategoryService;
    private final TagService tagService;
    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final UserService userService;
    private final NotificationService notificationService;

    public PageResult<ResourceCardVO> page(ResourceQueryRequest request) {
        LambdaQueryWrapper<ResourceItem> wrapper = new LambdaQueryWrapper<ResourceItem>()
                .eq(ResourceItem::getStatus, STATUS_PUBLISHED);
        if (request.getCategoryId() != null) {
            wrapper.eq(ResourceItem::getCategoryId, request.getCategoryId());
        }
        if (StringUtils.isNotBlank(request.getKeyword())) {
            String keyword = request.getKeyword().trim();
            wrapper.and(w -> w.like(ResourceItem::getTitle, keyword).or().like(ResourceItem::getSummary, keyword));
        }
        if (request.getTagId() != null) {
            List<Long> resourceIds = resourceTagRelMapper.selectList(new LambdaQueryWrapper<ResourceTagRel>()
                            .eq(ResourceTagRel::getTagId, request.getTagId()))
                    .stream().map(ResourceTagRel::getResourceId).distinct().toList();
            if (resourceIds.isEmpty()) {
                return emptyPage(request.getPageNo(), request.getPageSize());
            }
            wrapper.in(ResourceItem::getId, resourceIds);
        }
        applySort(wrapper, request.getSort());
        Page<ResourceItem> page = resourceItemMapper.selectPage(Page.of(request.getPageNo(), request.getPageSize()), wrapper);
        List<ResourceCardVO> list = page.getRecords().stream().map(this::toCardVO).toList();
        return PageResult.<ResourceCardVO>builder()
                .list(list)
                .total(page.getTotal())
                .pageNo(page.getCurrent())
                .pageSize(page.getSize())
                .build();
    }

    public List<ResourceCardVO> recommend(Integer size) {
        int limit = size == null || size <= 0 ? 6 : Math.min(size, 20);
        return resourceItemMapper.selectList(new LambdaQueryWrapper<ResourceItem>()
                        .eq(ResourceItem::getStatus, STATUS_PUBLISHED)
                        .eq(ResourceItem::getIsRecommended, 1)
                        .orderByDesc(ResourceItem::getSortWeight)
                        .orderByDesc(ResourceItem::getDownloadCount)
                        .last("limit " + limit))
                .stream().map(this::toCardVO).toList();
    }

    public PageResult<ResourceCardVO> myResources(long pageNo, long pageSize, Integer status) {
        Long userId = requireLogin();
        LambdaQueryWrapper<ResourceItem> wrapper = new LambdaQueryWrapper<ResourceItem>()
                .eq(ResourceItem::getUserId, userId)
                .ne(ResourceItem::getStatus, STATUS_DELETED)
                .orderByDesc(ResourceItem::getUpdatedAt);
        if (status != null) {
            wrapper.eq(ResourceItem::getStatus, status);
        }
        Page<ResourceItem> page = resourceItemMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
        return PageResult.<ResourceCardVO>builder()
                .list(page.getRecords().stream().map(this::toCardVO).toList())
                .total(page.getTotal())
                .pageNo(page.getCurrent())
                .pageSize(page.getSize())
                .build();
    }

    @Transactional(rollbackFor = Exception.class)
    public Long create(ResourceSaveRequest request) {
        Long userId = requireLogin();
        ResourceCategory category = requireEnabledCategory(request.getCategoryId());
        ResourceItem item = new ResourceItem();
        item.setUserId(userId);
        item.setCategoryId(category.getId());
        fillResourceCore(item, request);
        item.setViewCount(0);
        item.setDownloadCount(0);
        item.setLikeCount(0);
        item.setFavoriteCount(0);
        item.setCommentCount(0);
        item.setIsRecommended(0);
        item.setSortWeight(0);
        item.setStatus(Boolean.TRUE.equals(request.getSaveAsDraft()) ? STATUS_DRAFT : STATUS_PENDING);
        item.setDeleted(0);
        resourceItemMapper.insert(item);
        ResourceVersion version = createVersion(item.getId(), request.getInitialVersion(), true);
        bindCurrentVersion(item, version);
        resourceItemMapper.updateById(item);
        syncTags(item.getId(), request.getTagIds());
        refreshCategoryCount(category.getId());
        return item.getId();
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Long resourceId, ResourceSaveRequest request) {
        Long userId = requireLogin();
        ResourceItem item = requireResource(resourceId);
        if (!item.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权编辑该资源");
        }
        ResourceCategory category = requireEnabledCategory(request.getCategoryId());
        Long oldCategoryId = item.getCategoryId();
        item.setCategoryId(category.getId());
        fillResourceCore(item, request);
        if (Boolean.TRUE.equals(request.getSaveAsDraft())) {
            item.setStatus(STATUS_DRAFT);
        }
        resourceItemMapper.updateById(item);

        ResourceVersion currentVersion = getCurrentVersion(item.getId());
        if (currentVersion == null) {
            currentVersion = createVersion(item.getId(), request.getInitialVersion(), true);
        } else {
            updateVersionEntity(currentVersion, request.getInitialVersion());
            currentVersion.setIsCurrent(1);
            currentVersion.setStatus(request.getInitialVersion().getStatus() == null ? 1 : request.getInitialVersion().getStatus());
            resourceVersionMapper.updateById(currentVersion);
        }
        bindCurrentVersion(item, currentVersion);
        resourceItemMapper.updateById(item);
        syncTags(item.getId(), request.getTagIds());
        refreshCategoryCount(oldCategoryId);
        refreshCategoryCount(category.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public void submitAudit(Long resourceId) {
        Long userId = requireLogin();
        ResourceItem item = requireResource(resourceId);
        if (!item.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权提交该资源");
        }
        if (item.getStatus() != STATUS_DRAFT && item.getStatus() != STATUS_OFFLINE) {
            throw new BusinessException("当前状态不能提交审核");
        }
        item.setStatus(STATUS_PENDING);
        item.setAuditRemark(null);
        resourceItemMapper.updateById(item);
    }

    @Transactional(rollbackFor = Exception.class)
    public void changeOwnStatus(Long resourceId, Integer status) {
        Long userId = requireLogin();
        ResourceItem item = requireResource(resourceId);
        if (!item.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权操作该资源");
        }
        if (status == null) {
            throw new BusinessException("状态不能为空");
        }
        if (status == STATUS_OFFLINE && item.getStatus() == STATUS_PUBLISHED) {
            item.setStatus(STATUS_OFFLINE);
        } else if (status == STATUS_DELETED) {
            item.setStatus(STATUS_DELETED);
        } else {
            throw new BusinessException("当前仅支持下架或删除资源");
        }
        resourceItemMapper.updateById(item);
        refreshCategoryCount(item.getCategoryId());
    }

    public ResourceDetailVO detail(Long resourceId) {
        ResourceItem item = requireResource(resourceId);
        Long currentUserId = CurrentUserUtils.getCurrentUserId();
        boolean isOwner = currentUserId != null && currentUserId.equals(item.getUserId());
        if (!isOwner && (item.getStatus() == null || item.getStatus() != STATUS_PUBLISHED)) {
            throw new BusinessException("资源不存在或暂不可访问");
        }
        if (item.getStatus() == STATUS_PUBLISHED) {
            resourceItemMapper.update(null, new LambdaUpdateWrapper<ResourceItem>()
                    .eq(ResourceItem::getId, item.getId())
                    .setSql("view_count = COALESCE(view_count, 0) + 1"));
            item.setViewCount((item.getViewCount() == null ? 0 : item.getViewCount()) + 1);
        }
        List<ResourceVersionVO> versions = resourceVersionMapper.selectList(new LambdaQueryWrapper<ResourceVersion>()
                        .eq(ResourceVersion::getResourceId, item.getId())
                        .orderByDesc(ResourceVersion::getCreatedAt))
                .stream().map(this::toVersionVO).toList();
        ResourceVersionVO currentVersion = versions.stream().filter(v -> Integer.valueOf(1).equals(v.getIsCurrent())).findFirst().orElse(null);
        return ResourceDetailVO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .categoryId(item.getCategoryId())
                .categoryName(categoryName(item.getCategoryId()))
                .summary(item.getSummary())
                .content(item.getContent())
                .coverUrl(item.getCoverUrl())
                .authorId(item.getUserId())
                .authorForumUid(getUser(item.getUserId()) == null ? null : getUser(item.getUserId()).getForumUid())
                .authorName(authorName(item.getUserId()))
                .authorAvatarUrl(profile(item.getUserId()) == null ? null : profile(item.getUserId()).getAvatarUrl())
                .authorSignature(profile(item.getUserId()) == null ? null : profile(item.getUserId()).getSignature())
                .authorBusinessCard(profile(item.getUserId()) == null ? null : profile(item.getUserId()).getBusinessCard())
                .authorUserLevel(profile(item.getUserId()) == null || profile(item.getUserId()).getUserLevel() == null ? 1 : profile(item.getUserId()).getUserLevel())
                .currentVersionNo(item.getCurrentVersionNo())
                .mcVersions(item.getMcVersions())
                .downloadType(item.getDownloadType())
                .downloadUrl(item.getDownloadUrl())
                .fileUrl(item.getFileUrl())
                .downloadCount(nvl(item.getDownloadCount()))
                .favoriteCount(nvl(item.getFavoriteCount()))
                .likeCount(nvl(item.getLikeCount()))
                .commentCount(nvl(item.getCommentCount()))
                .viewCount(nvl(item.getViewCount()))
                .status(item.getStatus())
                .isRecommended(item.getIsRecommended())
                .isFavorited(hasFavorited(currentUserId, item.getId()))
                .isLiked(hasLiked(currentUserId, item.getId()))
                .auditRemark(item.getAuditRemark())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .tags(listTags(item.getId()))
                .currentVersion(currentVersion)
                .versions(versions)
                .relatedResources(relatedResources(item))
                .comments(comments(item.getId()))
                .build();
    }

    @Transactional(rollbackFor = Exception.class)
    public void favorite(Long resourceId) {
        Long userId = requireLogin();
        ResourceItem item = requirePublishedResource(resourceId);
        if (item.getUserId().equals(userId)) {
            throw new BusinessException("不能收藏自己的资源");
        }
        long exists = resourceFavoriteMapper.selectCount(new LambdaQueryWrapper<ResourceFavorite>()
                .eq(ResourceFavorite::getUserId, userId)
                .eq(ResourceFavorite::getResourceId, resourceId));
        if (exists > 0) {
            return;
        }
        ResourceFavorite favorite = new ResourceFavorite();
        favorite.setUserId(userId);
        favorite.setResourceId(resourceId);
        favorite.setDeleted(0);
        resourceFavoriteMapper.insert(favorite);
        resourceItemMapper.update(null, new LambdaUpdateWrapper<ResourceItem>()
                .eq(ResourceItem::getId, resourceId)
                .setSql("favorite_count = COALESCE(favorite_count, 0) + 1"));
        incrementProfileCounter(userId, "favorite_count", 1);
        notificationService.push(item.getUserId(), "RESOURCE_FAVORITE", "资源被收藏", "你的资源《" + item.getTitle() + "》被一位用户收藏了。", item.getId(), "RESOURCE");
    }

    @Transactional(rollbackFor = Exception.class)
    public void unfavorite(Long resourceId) {
        Long userId = requireLogin();
        int affected = resourceFavoriteMapper.delete(new LambdaQueryWrapper<ResourceFavorite>()
                .eq(ResourceFavorite::getUserId, userId)
                .eq(ResourceFavorite::getResourceId, resourceId));
        if (affected <= 0) {
            return;
        }
        resourceItemMapper.update(null, new LambdaUpdateWrapper<ResourceItem>()
                .eq(ResourceItem::getId, resourceId)
                .setSql("favorite_count = GREATEST(COALESCE(favorite_count, 0) - 1, 0)"));
        incrementProfileCounter(userId, "favorite_count", -1);
    }

    @Transactional(rollbackFor = Exception.class)
    public void like(Long resourceId) {
        Long userId = requireLogin();
        ResourceItem item = requirePublishedResource(resourceId);
        if (item.getUserId().equals(userId)) {
            throw new BusinessException("不能给自己的资源点赞");
        }
        long exists = resourceLikeMapper.selectCount(new LambdaQueryWrapper<ResourceLike>()
                .eq(ResourceLike::getUserId, userId)
                .eq(ResourceLike::getResourceId, resourceId));
        if (exists > 0) {
            return;
        }
        ResourceLike like = new ResourceLike();
        like.setUserId(userId);
        like.setResourceId(resourceId);
        like.setDeleted(0);
        resourceLikeMapper.insert(like);
        resourceItemMapper.update(null, new LambdaUpdateWrapper<ResourceItem>()
                .eq(ResourceItem::getId, resourceId)
                .setSql("like_count = COALESCE(like_count, 0) + 1"));
        incrementProfileCounter(item.getUserId(), "like_received_count", 1);
        notificationService.push(item.getUserId(), "RESOURCE_LIKE", "资源收到点赞", "你的资源《" + item.getTitle() + "》收到了一次新的点赞。", item.getId(), "RESOURCE");
    }

    @Transactional(rollbackFor = Exception.class)
    public void unlike(Long resourceId) {
        Long userId = requireLogin();
        ResourceItem item = requireResource(resourceId);
        int affected = resourceLikeMapper.delete(new LambdaQueryWrapper<ResourceLike>()
                .eq(ResourceLike::getUserId, userId)
                .eq(ResourceLike::getResourceId, resourceId));
        if (affected <= 0) {
            return;
        }
        resourceItemMapper.update(null, new LambdaUpdateWrapper<ResourceItem>()
                .eq(ResourceItem::getId, resourceId)
                .setSql("like_count = GREATEST(COALESCE(like_count, 0) - 1, 0)"));
        incrementProfileCounter(item.getUserId(), "like_received_count", -1);
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, String> download(Long resourceId, HttpServletRequest httpServletRequest) {
        ResourceItem item = requirePublishedResource(resourceId);
        Long userId = CurrentUserUtils.getCurrentUserId();
        String ip = clientIp(httpServletRequest);
        String ua = httpServletRequest.getHeader("User-Agent");
        LocalDateTime tenMinutesAgo = LocalDateTime.now().minusMinutes(10);
        LambdaQueryWrapper<ResourceDownloadLog> wrapper = new LambdaQueryWrapper<ResourceDownloadLog>()
                .eq(ResourceDownloadLog::getResourceId, resourceId)
                .ge(ResourceDownloadLog::getCreatedAt, tenMinutesAgo)
                .and(w -> {
                    if (userId != null) {
                        w.eq(ResourceDownloadLog::getUserId, userId);
                    } else {
                        w.eq(ResourceDownloadLog::getIp, ip);
                    }
                })
                .last("limit 1");
        boolean counted = resourceDownloadLogMapper.selectCount(wrapper) <= 0;
        ResourceDownloadLog log = new ResourceDownloadLog();
        log.setResourceId(resourceId);
        log.setUserId(userId);
        log.setIp(ip);
        log.setUa(StringUtils.left(ua, 255));
        log.setIsCounted(counted ? 1 : 0);
        log.setDeleted(0);
        resourceDownloadLogMapper.insert(log);
        if (counted) {
            resourceItemMapper.update(null, new LambdaUpdateWrapper<ResourceItem>()
                    .eq(ResourceItem::getId, resourceId)
                    .setSql("download_count = COALESCE(download_count, 0) + 1"));
        }
        Map<String, String> result = new HashMap<>();
        result.put("url", StringUtils.defaultIfBlank(item.getDownloadUrl(), item.getFileUrl()));
        result.put("downloadUrl", item.getDownloadUrl());
        result.put("fileUrl", item.getFileUrl());
        return result;
    }

    public List<ResourceCommentVO> comments(Long resourceId) {
        requirePublishedOrOwned(resourceId);
        List<ResourceComment> list = resourceCommentMapper.selectList(new LambdaQueryWrapper<ResourceComment>()
                .eq(ResourceComment::getResourceId, resourceId)
                .eq(ResourceComment::getStatus, 1)
                .orderByAsc(ResourceComment::getCreatedAt));
        Map<Long, List<ResourceCommentVO>> grouped = list.stream().map(this::toCommentVO)
                .collect(Collectors.groupingBy(vo -> vo.getRootId() == null ? 0L : vo.getRootId(), LinkedHashMap::new, Collectors.toList()));
        List<ResourceCommentVO> roots = grouped.getOrDefault(0L, new ArrayList<>());
        roots.forEach(root -> root.setChildren(grouped.getOrDefault(root.getId(), List.of())));
        return roots;
    }

    @Transactional(rollbackFor = Exception.class)
    public Long createComment(Long resourceId, CreateResourceCommentRequest request) {
        Long userId = requireLogin();
        ResourceItem item = requirePublishedResource(resourceId);
        Long parentId = request.getParentId() == null ? 0L : request.getParentId();
        ResourceComment parent = null;
        if (parentId != 0L) {
            parent = resourceCommentMapper.selectById(parentId);
            if (parent == null || !resourceId.equals(parent.getResourceId())) {
                throw new BusinessException("回复目标不存在");
            }
        }
        ResourceComment comment = new ResourceComment();
        comment.setResourceId(resourceId);
        comment.setUserId(userId);
        comment.setParentId(parentId);
        comment.setRootId(parent == null ? 0L : ((parent.getRootId() == null || parent.getRootId() == 0L) ? parent.getId() : parent.getRootId()));
        comment.setReplyUserId(request.getReplyUserId() != null ? request.getReplyUserId() : (parent == null ? null : parent.getUserId()));
        comment.setContent(SanitizeUtils.cleanText(request.getContent()));
        comment.setStatus(1);
        comment.setDeleted(0);
        resourceCommentMapper.insert(comment);
        resourceItemMapper.update(null, new LambdaUpdateWrapper<ResourceItem>()
                .eq(ResourceItem::getId, resourceId)
                .setSql("comment_count = COALESCE(comment_count, 0) + 1"));
        userService.incrementCommentCount(userId, 1);

        Set<Long> notifiedUserIds = new HashSet<>();
        if (parent != null && !parent.getUserId().equals(userId)) {
            notificationService.push(parent.getUserId(), "RESOURCE_COMMENT_REPLY", "资源评论收到回复", "你在资源《" + item.getTitle() + "》下的评论收到了回复。", item.getId(), "RESOURCE");
            notifiedUserIds.add(parent.getUserId());
        } else if (!item.getUserId().equals(userId)) {
            notificationService.push(item.getUserId(), "RESOURCE_COMMENT", "资源收到新评论", "你的资源《" + item.getTitle() + "》收到了新的评论。", item.getId(), "RESOURCE");
            notifiedUserIds.add(item.getUserId());
        }
        for (Long mentionedUserId : resolveMentionedUserIds(comment.getContent())) {
            if (mentionedUserId.equals(userId) || notifiedUserIds.contains(mentionedUserId)) {
                continue;
            }
            notificationService.push(mentionedUserId, "RESOURCE_COMMENT_MENTION", "你在资源评论中被提到了", "有人在资源《" + item.getTitle() + "》的评论中 @了你。", item.getId(), "RESOURCE");
        }
        return comment.getId();
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteComment(Long commentId) {
        Long userId = requireLogin();
        ResourceComment comment = resourceCommentMapper.selectById(commentId);
        if (comment == null) {
            throw new BusinessException("评论不存在");
        }
        if (!userId.equals(comment.getUserId())) {
            throw new BusinessException(403, "无权删除该评论");
        }
        resourceCommentMapper.deleteById(commentId);
        resourceItemMapper.update(null, new LambdaUpdateWrapper<ResourceItem>()
                .eq(ResourceItem::getId, comment.getResourceId())
                .setSql("comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)"));
        userService.incrementCommentCount(userId, -1);
    }

    public Page<Map<String, Object>> pageAdmin(long pageNo, long pageSize, String keyword, Long categoryId, Integer status) {
        LambdaQueryWrapper<ResourceItem> wrapper = new LambdaQueryWrapper<ResourceItem>();
        if (StringUtils.isNotBlank(keyword)) {
            String value = keyword.trim();
            wrapper.and(w -> w.like(ResourceItem::getTitle, value).or().like(ResourceItem::getSummary, value));
        }
        if (categoryId != null) {
            wrapper.eq(ResourceItem::getCategoryId, categoryId);
        }
        if (status != null) {
            wrapper.eq(ResourceItem::getStatus, status);
        }
        wrapper.orderByDesc(ResourceItem::getUpdatedAt);
        Page<ResourceItem> page = resourceItemMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
        Page<Map<String, Object>> result = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        result.setRecords(page.getRecords().stream().map(this::toAdminRow).toList());
        return result;
    }

    public ResourceDetailVO detailAdmin(Long resourceId) {
        ResourceItem item = requireResource(resourceId);
        return detailForAdmin(item);
    }

    @Transactional(rollbackFor = Exception.class)
    public void audit(Long resourceId, ResourceAuditRequest request) {
        ResourceItem item = requireResource(resourceId);
        if (item.getStatus() != STATUS_PENDING) {
            throw new BusinessException("该资源当前不在待审核状态");
        }
        if (Boolean.TRUE.equals(request.getPass())) {
            item.setStatus(STATUS_PUBLISHED);
            item.setAuditRemark(StringUtils.defaultIfBlank(request.getRemark(), "审核通过"));
            notificationService.push(item.getUserId(), "RESOURCE_AUDIT_PASS", "资源审核通过", "你的资源《" + item.getTitle() + "》已审核通过并发布。", item.getId(), "RESOURCE");
        } else {
            item.setStatus(STATUS_DRAFT);
            item.setAuditRemark(StringUtils.defaultIfBlank(request.getRemark(), "审核未通过，请完善后重新提交"));
            notificationService.push(item.getUserId(), "RESOURCE_AUDIT_REJECT", "资源审核未通过", "你的资源《" + item.getTitle() + "》审核未通过：" + item.getAuditRemark(), item.getId(), "RESOURCE");
        }
        resourceItemMapper.updateById(item);
        refreshCategoryCount(item.getCategoryId());
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateAdminStatus(Long resourceId, Integer status) {
        ResourceItem item = requireResource(resourceId);
        if (!List.of(STATUS_PUBLISHED, STATUS_OFFLINE, STATUS_DELETED).contains(status)) {
            throw new BusinessException("不支持的状态操作");
        }
        item.setStatus(status);
        resourceItemMapper.updateById(item);
        refreshCategoryCount(item.getCategoryId());
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateRecommend(Long resourceId, Boolean recommended) {
        ResourceItem item = requireResource(resourceId);
        item.setIsRecommended(Boolean.TRUE.equals(recommended) ? 1 : 0);
        resourceItemMapper.updateById(item);
    }

    public Map<String, Object> statsAdmin() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalResources", resourceItemMapper.selectCount(new LambdaQueryWrapper<ResourceItem>()));
        stats.put("publishedResources", resourceItemMapper.selectCount(new LambdaQueryWrapper<ResourceItem>().eq(ResourceItem::getStatus, STATUS_PUBLISHED)));
        stats.put("pendingResources", resourceItemMapper.selectCount(new LambdaQueryWrapper<ResourceItem>().eq(ResourceItem::getStatus, STATUS_PENDING)));
        stats.put("totalDownloads", sumInt(ResourceItem::getDownloadCount));
        stats.put("totalViews", sumInt(ResourceItem::getViewCount));
        stats.put("categoryDistribution", resourceCategoryService.listAll());
        return stats;
    }

    private Integer sumInt(Function<ResourceItem, Integer> getter) {
        return resourceItemMapper.selectList(new LambdaQueryWrapper<ResourceItem>().select(ResourceItem::getId, ResourceItem::getDownloadCount, ResourceItem::getViewCount))
                .stream().map(getter).filter(Objects::nonNull).reduce(0, Integer::sum);
    }

    private ResourceDetailVO detailForAdmin(ResourceItem item) {
        List<ResourceVersionVO> versions = resourceVersionMapper.selectList(new LambdaQueryWrapper<ResourceVersion>()
                        .eq(ResourceVersion::getResourceId, item.getId())
                        .orderByDesc(ResourceVersion::getCreatedAt))
                .stream().map(this::toVersionVO).toList();
        ResourceVersionVO currentVersion = versions.stream().filter(v -> Integer.valueOf(1).equals(v.getIsCurrent())).findFirst().orElse(null);
        return ResourceDetailVO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .categoryId(item.getCategoryId())
                .categoryName(categoryName(item.getCategoryId()))
                .summary(item.getSummary())
                .content(item.getContent())
                .coverUrl(item.getCoverUrl())
                .authorId(item.getUserId())
                .authorForumUid(getUser(item.getUserId()) == null ? null : getUser(item.getUserId()).getForumUid())
                .authorName(authorName(item.getUserId()))
                .authorAvatarUrl(profile(item.getUserId()) == null ? null : profile(item.getUserId()).getAvatarUrl())
                .authorSignature(profile(item.getUserId()) == null ? null : profile(item.getUserId()).getSignature())
                .authorBusinessCard(profile(item.getUserId()) == null ? null : profile(item.getUserId()).getBusinessCard())
                .authorUserLevel(profile(item.getUserId()) == null || profile(item.getUserId()).getUserLevel() == null ? 1 : profile(item.getUserId()).getUserLevel())
                .currentVersionNo(item.getCurrentVersionNo())
                .mcVersions(item.getMcVersions())
                .downloadType(item.getDownloadType())
                .downloadUrl(item.getDownloadUrl())
                .fileUrl(item.getFileUrl())
                .downloadCount(nvl(item.getDownloadCount()))
                .favoriteCount(nvl(item.getFavoriteCount()))
                .likeCount(nvl(item.getLikeCount()))
                .commentCount(nvl(item.getCommentCount()))
                .viewCount(nvl(item.getViewCount()))
                .status(item.getStatus())
                .isRecommended(item.getIsRecommended())
                .isFavorited(false)
                .isLiked(false)
                .auditRemark(item.getAuditRemark())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .tags(listTags(item.getId()))
                .currentVersion(currentVersion)
                .versions(versions)
                .relatedResources(List.of())
                .comments(comments(item.getId()))
                .build();
    }

    private PageResult<ResourceCardVO> emptyPage(Long pageNo, Long pageSize) {
        return PageResult.<ResourceCardVO>builder().list(List.of()).total(0L).pageNo(pageNo).pageSize(pageSize).build();
    }

    private void applySort(LambdaQueryWrapper<ResourceItem> wrapper, String sort) {
        String value = StringUtils.defaultIfBlank(sort, "latest").trim().toLowerCase(Locale.ROOT);
        switch (value) {
            case "hot" -> wrapper.orderByDesc(ResourceItem::getLikeCount).orderByDesc(ResourceItem::getFavoriteCount).orderByDesc(ResourceItem::getCommentCount).orderByDesc(ResourceItem::getCreatedAt);
            case "downloads" -> wrapper.orderByDesc(ResourceItem::getDownloadCount).orderByDesc(ResourceItem::getCreatedAt);
            default -> wrapper.orderByDesc(ResourceItem::getIsRecommended).orderByDesc(ResourceItem::getCreatedAt);
        }
    }

    private void fillResourceCore(ResourceItem item, ResourceSaveRequest request) {
        item.setTitle(SanitizeUtils.cleanText(request.getTitle()));
        item.setSummary(SanitizeUtils.cleanText(request.getSummary()));
        item.setContent(request.getContent());
        item.setCoverUrl(request.getCoverUrl());
    }

    private ResourceVersion createVersion(Long resourceId, ResourceVersionSaveRequest request, boolean current) {
        ResourceVersion version = new ResourceVersion();
        version.setResourceId(resourceId);
        updateVersionEntity(version, request);
        version.setIsCurrent(current ? 1 : 0);
        version.setStatus(request.getStatus() == null ? 1 : request.getStatus());
        version.setDeleted(0);
        resourceVersionMapper.insert(version);
        return version;
    }

    private void updateVersionEntity(ResourceVersion version, ResourceVersionSaveRequest request) {
        version.setVersionNo(SanitizeUtils.cleanText(request.getVersionNo()));
        version.setChangelog(request.getChangelog());
        version.setMcVersions(SanitizeUtils.cleanText(request.getMcVersions()));
        version.setDownloadType(request.getDownloadType());
        version.setDownloadUrl(request.getDownloadUrl());
        version.setFileUrl(request.getFileUrl());
    }

    private void bindCurrentVersion(ResourceItem item, ResourceVersion version) {
        item.setCurrentVersionId(version.getId());
        item.setCurrentVersionNo(version.getVersionNo());
        item.setMcVersions(version.getMcVersions());
        item.setDownloadType(version.getDownloadType());
        item.setDownloadUrl(version.getDownloadUrl());
        item.setFileUrl(version.getFileUrl());
    }

    private void syncTags(Long resourceId, List<Long> tagIds) {
        resourceTagRelMapper.delete(new LambdaQueryWrapper<ResourceTagRel>().eq(ResourceTagRel::getResourceId, resourceId));
        if (tagIds == null || tagIds.isEmpty()) {
            return;
        }
        List<Long> validTagIds = tagService.listByIds(tagIds).stream().map(ForumTag::getId).distinct().toList();
        for (Long tagId : validTagIds) {
            ResourceTagRel rel = new ResourceTagRel();
            rel.setResourceId(resourceId);
            rel.setTagId(tagId);
            rel.setDeleted(0);
            resourceTagRelMapper.insert(rel);
        }
    }

    private List<ResourceCardVO.TagVO> listTags(Long resourceId) {
        return resourceTagRelMapper.selectList(new LambdaQueryWrapper<ResourceTagRel>()
                        .eq(ResourceTagRel::getResourceId, resourceId))
                .stream()
                .map(ResourceTagRel::getTagId)
                .distinct()
                .map(tagId -> {
                    try {
                        ForumTag tag = tagService.getById(tagId);
                        return ResourceCardVO.TagVO.builder().id(tag.getId()).name(tag.getName()).build();
                    } catch (Exception ignored) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }

    private ResourceCardVO toCardVO(ResourceItem item) {
        SysUser user = getUser(item.getUserId());
        SysUserProfile profile = profile(item.getUserId());
        return ResourceCardVO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .categoryId(item.getCategoryId())
                .categoryName(categoryName(item.getCategoryId()))
                .summary(item.getSummary())
                .coverUrl(item.getCoverUrl())
                .authorId(item.getUserId())
                .authorForumUid(user == null ? null : user.getForumUid())
                .authorName(profile == null || StringUtils.isBlank(profile.getNickname()) ? (user == null ? "用户" : user.getUsername()) : profile.getNickname())
                .authorAvatarUrl(profile == null ? null : profile.getAvatarUrl())
                .currentVersionNo(item.getCurrentVersionNo())
                .mcVersions(item.getMcVersions())
                .downloadCount(nvl(item.getDownloadCount()))
                .favoriteCount(nvl(item.getFavoriteCount()))
                .likeCount(nvl(item.getLikeCount()))
                .commentCount(nvl(item.getCommentCount()))
                .isRecommended(item.getIsRecommended())
                .status(item.getStatus())
                .createdAt(item.getCreatedAt())
                .tags(listTags(item.getId()))
                .build();
    }

    private ResourceVersionVO toVersionVO(ResourceVersion version) {
        return ResourceVersionVO.builder()
                .id(version.getId())
                .resourceId(version.getResourceId())
                .versionNo(version.getVersionNo())
                .changelog(version.getChangelog())
                .mcVersions(version.getMcVersions())
                .downloadType(version.getDownloadType())
                .downloadUrl(version.getDownloadUrl())
                .fileUrl(version.getFileUrl())
                .status(version.getStatus())
                .isCurrent(version.getIsCurrent())
                .createdAt(version.getCreatedAt())
                .build();
    }

    private ResourceCommentVO toCommentVO(ResourceComment comment) {
        SysUser user = getUser(comment.getUserId());
        SysUserProfile profile = profile(comment.getUserId());
        String replyNickname = null;
        Long replyForumUid = null;
        if (comment.getReplyUserId() != null) {
            SysUserProfile replyProfile = profile(comment.getReplyUserId());
            SysUser replyUser = getUser(comment.getReplyUserId());
            replyNickname = replyProfile == null ? null : replyProfile.getNickname();
            replyForumUid = replyUser == null ? null : replyUser.getForumUid();
        }
        return ResourceCommentVO.builder()
                .id(comment.getId())
                .resourceId(comment.getResourceId())
                .userId(comment.getUserId())
                .forumUid(user == null ? null : user.getForumUid())
                .username(user == null ? null : user.getUsername())
                .nickname(profile == null ? "用户" : profile.getNickname())
                .avatarUrl(profile == null ? null : profile.getAvatarUrl())
                .signature(profile == null ? null : profile.getSignature())
                .businessCard(profile == null ? null : profile.getBusinessCard())
                .userLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                .parentId(comment.getParentId())
                .rootId(comment.getRootId())
                .replyUserId(comment.getReplyUserId())
                .replyNickname(replyNickname)
                .replyForumUid(replyForumUid)
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .children(new ArrayList<>())
                .build();
    }

    private List<ResourceCardVO> relatedResources(ResourceItem item) {
        return resourceItemMapper.selectList(new LambdaQueryWrapper<ResourceItem>()
                        .eq(ResourceItem::getCategoryId, item.getCategoryId())
                        .eq(ResourceItem::getStatus, STATUS_PUBLISHED)
                        .ne(ResourceItem::getId, item.getId())
                        .orderByDesc(ResourceItem::getDownloadCount)
                        .last("limit 6"))
                .stream().map(this::toCardVO).toList();
    }

    private Set<Long> resolveMentionedUserIds(String content) {
        Set<Long> userIds = new HashSet<>();
        Matcher matcher = MENTION_PATTERN.matcher(StringUtils.defaultString(content));
        while (matcher.find()) {
            String username = matcher.group(1);
            SysUser user = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                    .eq(SysUser::getUsername, username)
                    .last("limit 1"));
            if (user != null) {
                userIds.add(user.getId());
            }
        }
        return userIds;
    }

    private void refreshCategoryCount(Long categoryId) {
        if (categoryId == null) {
            return;
        }
        Long count = resourceItemMapper.selectCount(new LambdaQueryWrapper<ResourceItem>()
                .eq(ResourceItem::getCategoryId, categoryId)
                .eq(ResourceItem::getStatus, STATUS_PUBLISHED));
        ResourceCategory category = resourceCategoryMapper.selectById(categoryId);
        if (category != null) {
            category.setResourceCount(count == null ? 0 : count.intValue());
            resourceCategoryMapper.updateById(category);
        }
    }

    private void incrementProfileCounter(Long userId, String columnName, int delta) {
        sysUserProfileMapper.update(null, new LambdaUpdateWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId)
                .setSql(columnName + " = GREATEST(COALESCE(" + columnName + ", 0) + " + delta + ", 0)"));
    }

    private ResourceCategory requireEnabledCategory(Long categoryId) {
        ResourceCategory category = resourceCategoryService.requireCategory(categoryId);
        if (category.getStatus() == null || category.getStatus() != 1) {
            throw new BusinessException("资源分类已禁用");
        }
        return category;
    }

    private ResourceItem requireResource(Long resourceId) {
        ResourceItem item = resourceItemMapper.selectById(resourceId);
        if (item == null || (item.getDeleted() != null && item.getDeleted() == 1)) {
            throw new BusinessException("资源不存在");
        }
        return item;
    }

    private ResourceItem requirePublishedResource(Long resourceId) {
        ResourceItem item = requireResource(resourceId);
        if (item.getStatus() == null || item.getStatus() != STATUS_PUBLISHED) {
            throw new BusinessException("资源不存在或暂不可访问");
        }
        return item;
    }

    private void requirePublishedOrOwned(Long resourceId) {
        ResourceItem item = requireResource(resourceId);
        Long currentUserId = CurrentUserUtils.getCurrentUserId();
        if (item.getStatus() != STATUS_PUBLISHED && (currentUserId == null || !currentUserId.equals(item.getUserId()))) {
            throw new BusinessException("资源不存在或暂不可访问");
        }
    }

    private ResourceVersion getCurrentVersion(Long resourceId) {
        return resourceVersionMapper.selectOne(new LambdaQueryWrapper<ResourceVersion>()
                .eq(ResourceVersion::getResourceId, resourceId)
                .eq(ResourceVersion::getIsCurrent, 1)
                .last("limit 1"));
    }

    private Long requireLogin() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        return userId;
    }

    private boolean hasFavorited(Long userId, Long resourceId) {
        if (userId == null) {
            return false;
        }
        return resourceFavoriteMapper.selectCount(new LambdaQueryWrapper<ResourceFavorite>()
                .eq(ResourceFavorite::getUserId, userId)
                .eq(ResourceFavorite::getResourceId, resourceId)) > 0;
    }

    private boolean hasLiked(Long userId, Long resourceId) {
        if (userId == null) {
            return false;
        }
        return resourceLikeMapper.selectCount(new LambdaQueryWrapper<ResourceLike>()
                .eq(ResourceLike::getUserId, userId)
                .eq(ResourceLike::getResourceId, resourceId)) > 0;
    }

    private SysUser getUser(Long userId) {
        return userId == null ? null : sysUserMapper.selectById(userId);
    }

    private SysUserProfile profile(Long userId) {
        if (userId == null) {
            return null;
        }
        return sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId)
                .last("limit 1"));
    }

    private String categoryName(Long categoryId) {
        ResourceCategory category = categoryId == null ? null : resourceCategoryMapper.selectById(categoryId);
        return category == null ? "未知分类" : category.getName();
    }

    private String authorName(Long userId) {
        SysUser user = getUser(userId);
        SysUserProfile profile = profile(userId);
        if (profile != null && StringUtils.isNotBlank(profile.getNickname())) {
            return profile.getNickname();
        }
        return user == null ? "用户" : user.getUsername();
    }

    private int nvl(Integer value) {
        return value == null ? 0 : value;
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.isNotBlank(forwarded)) {
            return StringUtils.substringBefore(forwarded, ",").trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        return StringUtils.defaultIfBlank(realIp, request.getRemoteAddr());
    }

    private Map<String, Object> toAdminRow(ResourceItem item) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", item.getId());
        row.put("title", item.getTitle());
        row.put("categoryId", item.getCategoryId());
        row.put("categoryName", categoryName(item.getCategoryId()));
        row.put("authorId", item.getUserId());
        row.put("authorName", authorName(item.getUserId()));
        row.put("currentVersionNo", item.getCurrentVersionNo());
        row.put("downloadCount", nvl(item.getDownloadCount()));
        row.put("viewCount", nvl(item.getViewCount()));
        row.put("favoriteCount", nvl(item.getFavoriteCount()));
        row.put("likeCount", nvl(item.getLikeCount()));
        row.put("commentCount", nvl(item.getCommentCount()));
        row.put("status", item.getStatus());
        row.put("isRecommended", item.getIsRecommended());
        row.put("auditRemark", item.getAuditRemark());
        row.put("createdAt", item.getCreatedAt());
        row.put("updatedAt", item.getUpdatedAt());
        return row;
    }
}
