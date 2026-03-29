package com.hongchuang.platform.modules.post.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.achievement.service.AchievementService;
import com.hongchuang.platform.modules.board.entity.ForumBoard;
import com.hongchuang.platform.modules.board.service.BoardService;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import com.hongchuang.platform.modules.post.dto.CreatePostRequest;
import com.hongchuang.platform.modules.post.dto.PostQueryRequest;
import com.hongchuang.platform.modules.post.dto.UpdatePostRequest;
import com.hongchuang.platform.modules.post.entity.ForumPost;
import com.hongchuang.platform.modules.post.entity.ForumPostBlock;
import com.hongchuang.platform.modules.post.entity.ForumPostLike;
import com.hongchuang.platform.modules.post.entity.ForumPostTag;
import com.hongchuang.platform.modules.post.mapper.ForumPostBlockMapper;
import com.hongchuang.platform.modules.post.mapper.ForumPostLikeMapper;
import com.hongchuang.platform.modules.post.mapper.ForumPostMapper;
import com.hongchuang.platform.modules.post.mapper.ForumPostTagMapper;
import com.hongchuang.platform.modules.post.vo.PostDetailVO;
import com.hongchuang.platform.modules.post.vo.PostSummaryVO;
import com.hongchuang.platform.modules.social.mapper.ForumPostFavoriteMapper;
import com.hongchuang.platform.modules.tag.entity.ForumTag;
import com.hongchuang.platform.modules.tag.service.TagService;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import com.hongchuang.platform.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final ForumPostMapper forumPostMapper;
    private final ForumPostTagMapper forumPostTagMapper;
    private final ForumPostLikeMapper forumPostLikeMapper;
    private final ForumPostFavoriteMapper forumPostFavoriteMapper;
    private final ForumPostBlockMapper forumPostBlockMapper;
    private final BoardService boardService;
    private final TagService tagService;
    private final UserService userService;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final SysUserMapper sysUserMapper;
    private final AchievementService achievementService;
    private final NotificationService notificationService;

    @Transactional(rollbackFor = Exception.class)
    public Long create(CreatePostRequest request) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        validateBoardAndTags(request.getBoardId(), request.getTagIds());

        ForumPost post = new ForumPost();
        post.setUserId(userId);
        post.setBoardId(request.getBoardId());
        post.setTitle(SanitizeUtils.cleanText(request.getTitle()));
        post.setSummary(SanitizeUtils.cleanText(request.getSummary()));
        post.setContentMd(request.getContentMd());
        post.setContentHtml(SanitizeUtils.cleanHtml(request.getContentMd()));
        post.setViewCount(0);
        post.setLikeCount(0);
        post.setFavoriteCount(0);
        post.setCommentCount(0);
        post.setHotScore(BigDecimal.ZERO);
        post.setIsTop(0);
        post.setIsRecommended(0);
        post.setStatus(1);
        post.setAuditStatus(0);
        forumPostMapper.insert(post);

        savePostTags(post.getId(), request.getTagIds());
        boardService.incrementPostCount(post.getBoardId(), 1);
        userService.incrementPostCount(userId, 1);
        userService.addExperience(userId, 15);
        achievementService.evaluateMilestones(userId);
        return post.getId();
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Long postId, UpdatePostRequest request, boolean adminMode) {
        ForumPost post = requirePost(postId);
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (!adminMode && !post.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权编辑该帖子");
        }
        validateBoardAndTags(request.getBoardId(), request.getTagIds());

        if (!post.getBoardId().equals(request.getBoardId())) {
            boardService.incrementPostCount(post.getBoardId(), -1);
            boardService.incrementPostCount(request.getBoardId(), 1);
        }

        removePostTags(postId);

        post.setBoardId(request.getBoardId());
        post.setTitle(SanitizeUtils.cleanText(request.getTitle()));
        post.setSummary(SanitizeUtils.cleanText(request.getSummary()));
        post.setContentMd(request.getContentMd());
        post.setContentHtml(SanitizeUtils.cleanHtml(request.getContentMd()));
        forumPostMapper.updateById(post);

        savePostTags(postId, request.getTagIds());
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Long postId, boolean adminMode) {
        ForumPost post = requirePost(postId);
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (!adminMode && !post.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权删除该帖子");
        }
        removePostTags(postId);
        forumPostMapper.deleteById(postId);
        boardService.incrementPostCount(post.getBoardId(), -1);
        userService.incrementPostCount(post.getUserId(), -1);
        if (adminMode) {
            notificationService.push(post.getUserId(), "SYSTEM_DELETE_POST", "帖子被删除", "你发布的帖子《" + post.getTitle() + "》已被管理员删除。", postId, "POST");
        }
    }

    public PageResult<PostSummaryVO> page(PostQueryRequest request) {
        LambdaQueryWrapper<ForumPost> wrapper = new LambdaQueryWrapper<ForumPost>()
                .eq(ForumPost::getStatus, 1);

        if (request.getBoardId() != null) {
            wrapper.eq(ForumPost::getBoardId, request.getBoardId());
        }
        if (request.getAuthorId() != null) {
            wrapper.eq(ForumPost::getUserId, request.getAuthorId());
        }
        if (StringUtils.isNotBlank(request.getKeyword())) {
            wrapper.and(w -> w.like(ForumPost::getTitle, request.getKeyword())
                    .or().like(ForumPost::getSummary, request.getKeyword()));
        }
        if (request.getTagId() != null) {
            List<Long> postIds = forumPostTagMapper.selectList(new LambdaQueryWrapper<ForumPostTag>()
                            .eq(ForumPostTag::getTagId, request.getTagId()))
                    .stream()
                    .map(ForumPostTag::getPostId)
                    .distinct()
                    .toList();
            if (postIds.isEmpty()) {
                return PageResult.<PostSummaryVO>builder()
                        .list(Collections.emptyList())
                        .total(0L)
                        .pageNo(request.getPageNo())
                        .pageSize(request.getPageSize())
                        .build();
            }
            wrapper.in(ForumPost::getId, postIds);
        }

        Long currentUserId = CurrentUserUtils.getCurrentUserId();
        if (currentUserId != null) {
            Set<Long> blockedPostIds = forumPostBlockMapper.selectList(new LambdaQueryWrapper<ForumPostBlock>()
                            .eq(ForumPostBlock::getUserId, currentUserId))
                    .stream()
                    .map(ForumPostBlock::getPostId)
                    .collect(Collectors.toSet());
            if (!blockedPostIds.isEmpty()) {
                wrapper.notIn(ForumPost::getId, blockedPostIds);
            }
        }

        if ("hot".equalsIgnoreCase(request.getSort())) {
            wrapper.orderByDesc(ForumPost::getIsTop)
                    .orderByDesc(ForumPost::getIsRecommended)
                    .orderByDesc(ForumPost::getFavoriteCount)
                    .orderByDesc(ForumPost::getLikeCount)
                    .orderByDesc(ForumPost::getCommentCount)
                    .orderByDesc(ForumPost::getCreatedAt);
        } else {
            wrapper.orderByDesc(ForumPost::getIsTop)
                    .orderByDesc(ForumPost::getCreatedAt);
        }

        Page<ForumPost> page = forumPostMapper.selectPage(Page.of(request.getPageNo(), request.getPageSize()), wrapper);
        List<PostSummaryVO> list = page.getRecords().stream().map(this::toSummaryVO).toList();

        return PageResult.<PostSummaryVO>builder()
                .list(list)
                .total(page.getTotal())
                .pageNo(page.getCurrent())
                .pageSize(page.getSize())
                .build();
    }

    @Transactional(rollbackFor = Exception.class)
    public PostDetailVO detail(Long postId) {
        ForumPost post = requirePost(postId);
        post.setViewCount((post.getViewCount() == null ? 0 : post.getViewCount()) + 1);
        forumPostMapper.updateById(post);

        Long userId = CurrentUserUtils.getCurrentUserId();
        boolean liked = false;
        boolean favorited = false;
        boolean blocked = false;
        if (userId != null) {
            liked = forumPostLikeMapper.selectCount(new LambdaQueryWrapper<ForumPostLike>()
                    .eq(ForumPostLike::getUserId, userId)
                    .eq(ForumPostLike::getPostId, postId)) > 0;
            favorited = forumPostFavoriteMapper.selectCount(new LambdaQueryWrapper<com.hongchuang.platform.modules.social.entity.ForumPostFavorite>()
                    .eq(com.hongchuang.platform.modules.social.entity.ForumPostFavorite::getUserId, userId)
                    .eq(com.hongchuang.platform.modules.social.entity.ForumPostFavorite::getPostId, postId)) > 0;
            blocked = forumPostBlockMapper.selectCount(new LambdaQueryWrapper<ForumPostBlock>()
                    .eq(ForumPostBlock::getUserId, userId)
                    .eq(ForumPostBlock::getPostId, postId)) > 0;
        }
        return toDetailVO(post, liked, favorited, blocked);
    }

    @Transactional(rollbackFor = Exception.class)
    public void like(Long postId) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        ForumPost post = requirePost(postId);
        long exists = forumPostLikeMapper.selectCount(new LambdaQueryWrapper<ForumPostLike>()
                .eq(ForumPostLike::getUserId, userId)
                .eq(ForumPostLike::getPostId, postId));
        if (exists > 0) {
            return;
        }
        ForumPostLike like = new ForumPostLike();
        like.setUserId(userId);
        like.setPostId(postId);
        like.setCreatedAt(LocalDateTime.now());
        forumPostLikeMapper.insert(like);

        post.setLikeCount((post.getLikeCount() == null ? 0 : post.getLikeCount()) + 1);
        forumPostMapper.updateById(post);
    }

    @Transactional(rollbackFor = Exception.class)
    public void unlike(Long postId) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        ForumPost post = requirePost(postId);
        forumPostLikeMapper.delete(new LambdaQueryWrapper<ForumPostLike>()
                .eq(ForumPostLike::getUserId, userId)
                .eq(ForumPostLike::getPostId, postId));
        post.setLikeCount(Math.max((post.getLikeCount() == null ? 0 : post.getLikeCount()) - 1, 0));
        forumPostMapper.updateById(post);
    }

    public void block(Long postId) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        long exists = forumPostBlockMapper.selectCount(new LambdaQueryWrapper<ForumPostBlock>()
                .eq(ForumPostBlock::getUserId, userId)
                .eq(ForumPostBlock::getPostId, postId));
        if (exists > 0) {
            return;
        }
        ForumPostBlock block = new ForumPostBlock();
        block.setUserId(userId);
        block.setPostId(postId);
        block.setCreatedAt(LocalDateTime.now());
        forumPostBlockMapper.insert(block);
    }

    public void unblock(Long postId) {
        forumPostBlockMapper.delete(new LambdaQueryWrapper<ForumPostBlock>()
                .eq(ForumPostBlock::getUserId, CurrentUserUtils.getCurrentUserId())
                .eq(ForumPostBlock::getPostId, postId));
    }

    public Page<ForumPost> pageAdmin(long pageNo, long pageSize, String keyword, Integer status) {
        LambdaQueryWrapper<ForumPost> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(keyword)) {
            wrapper.and(w -> w.like(ForumPost::getTitle, keyword).or().like(ForumPost::getSummary, keyword));
        }
        if (status != null) {
            wrapper.eq(ForumPost::getStatus, status);
        }
        wrapper.orderByDesc(ForumPost::getCreatedAt);
        return forumPostMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
    }

    public void recommend(Long postId, boolean recommended) {
        ForumPost post = requirePost(postId);
        post.setIsRecommended(recommended ? 1 : 0);
        forumPostMapper.updateById(post);
    }

    public void updateStatus(Long postId, Integer status) {
        ForumPost post = requirePost(postId);
        post.setStatus(status);
        forumPostMapper.updateById(post);
        if (status != null && status != 1) {
            notificationService.push(post.getUserId(), "SYSTEM_POST_STATUS", "帖子状态变更", "你发布的帖子《" + post.getTitle() + "》状态已更新。", postId, "POST");
        }
    }

    private void validateBoardAndTags(Long boardId, List<Long> tagIds) {
        ForumBoard board = boardService.getById(boardId);
        if (board.getStatus() == null || board.getStatus() != 1) {
            throw new BusinessException("板块不可用");
        }
        if (tagIds != null && tagIds.size() > 5) {
            throw new BusinessException("单个帖子最多选择5个标签");
        }
        if (tagIds != null) {
            List<ForumTag> tags = tagService.listByIds(tagIds);
            if (tags.size() != tagIds.size()) {
                throw new BusinessException("存在无效标签");
            }
        }
    }

    private void savePostTags(Long postId, List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return;
        }
        for (Long tagId : tagIds) {
            ForumPostTag postTag = new ForumPostTag();
            postTag.setPostId(postId);
            postTag.setTagId(tagId);
            postTag.setCreatedAt(LocalDateTime.now());
            forumPostTagMapper.insert(postTag);
            tagService.incrementPostCount(tagId, 1);
        }
    }

    private void removePostTags(Long postId) {
        List<ForumPostTag> existing = forumPostTagMapper.selectList(new LambdaQueryWrapper<ForumPostTag>()
                .eq(ForumPostTag::getPostId, postId));
        for (ForumPostTag link : existing) {
            tagService.incrementPostCount(link.getTagId(), -1);
        }
        forumPostTagMapper.delete(new LambdaQueryWrapper<ForumPostTag>().eq(ForumPostTag::getPostId, postId));
    }

    private ForumPost requirePost(Long postId) {
        ForumPost post = forumPostMapper.selectById(postId);
        if (post == null || (post.getDeleted() != null && post.getDeleted() == 1)) {
            throw new BusinessException("帖子不存在");
        }
        return post;
    }

    private PostSummaryVO toSummaryVO(ForumPost post) {
        ForumBoard board = boardService.getById(post.getBoardId());
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, post.getUserId())
                .last("limit 1"));
        SysUser user = sysUserMapper.selectById(post.getUserId());
        List<PostSummaryVO.TagVO> tags = forumPostTagMapper.selectList(new LambdaQueryWrapper<ForumPostTag>()
                        .eq(ForumPostTag::getPostId, post.getId()))
                .stream()
                .map(link -> tagService.getById(link.getTagId()))
                .map(tag -> PostSummaryVO.TagVO.builder().id(tag.getId()).name(tag.getName()).build())
                .toList();

        return PostSummaryVO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .summary(post.getSummary())
                .authorId(post.getUserId())
                .authorForumUid(user == null ? null : user.getForumUid())
                .authorName(profile == null ? "用户" : profile.getNickname())
                .authorAvatarUrl(profile == null ? null : profile.getAvatarUrl())
                .authorSignature(profile == null ? null : profile.getSignature())
                .authorBusinessCard(profile == null ? null : profile.getBusinessCard())
                .authorUserLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                .boardId(post.getBoardId())
                .boardName(board.getName())
                .likeCount(post.getLikeCount())
                .favoriteCount(post.getFavoriteCount())
                .commentCount(post.getCommentCount())
                .createdAt(post.getCreatedAt())
                .tags(tags)
                .build();
    }

    private PostDetailVO toDetailVO(ForumPost post, boolean liked, boolean favorited, boolean blocked) {
        ForumBoard board = boardService.getById(post.getBoardId());
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, post.getUserId())
                .last("limit 1"));
        SysUser user = sysUserMapper.selectById(post.getUserId());
        List<PostSummaryVO.TagVO> tags = forumPostTagMapper.selectList(new LambdaQueryWrapper<ForumPostTag>()
                        .eq(ForumPostTag::getPostId, post.getId()))
                .stream()
                .map(link -> tagService.getById(link.getTagId()))
                .map(tag -> PostSummaryVO.TagVO.builder().id(tag.getId()).name(tag.getName()).build())
                .toList();

        return PostDetailVO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .summary(post.getSummary())
                .contentMd(post.getContentMd())
                .contentHtml(post.getContentHtml())
                .authorId(post.getUserId())
                .authorForumUid(user == null ? null : user.getForumUid())
                .authorName(profile == null ? "用户" : profile.getNickname())
                .authorAvatarUrl(profile == null ? null : profile.getAvatarUrl())
                .authorSignature(profile == null ? null : profile.getSignature())
                .authorBusinessCard(profile == null ? null : profile.getBusinessCard())
                .authorUserLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                .boardId(post.getBoardId())
                .boardName(board.getName())
                .likeCount(post.getLikeCount())
                .favoriteCount(post.getFavoriteCount())
                .commentCount(post.getCommentCount())
                .viewCount(post.getViewCount())
                .createdAt(post.getCreatedAt())
                .liked(liked)
                .favorited(favorited)
                .blocked(blocked)
                .tags(tags)
                .build();
    }
}
