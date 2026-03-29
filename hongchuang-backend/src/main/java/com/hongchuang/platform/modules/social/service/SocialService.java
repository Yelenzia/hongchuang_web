package com.hongchuang.platform.modules.social.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.modules.board.entity.ForumBoard;
import com.hongchuang.platform.modules.board.mapper.ForumBoardMapper;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import com.hongchuang.platform.modules.post.entity.ForumPost;
import com.hongchuang.platform.modules.post.entity.ForumPostTag;
import com.hongchuang.platform.modules.post.mapper.ForumPostMapper;
import com.hongchuang.platform.modules.post.mapper.ForumPostTagMapper;
import com.hongchuang.platform.modules.post.vo.PostSummaryVO;
import com.hongchuang.platform.modules.social.entity.ForumPostFavorite;
import com.hongchuang.platform.modules.social.entity.UserFollow;
import com.hongchuang.platform.modules.social.mapper.ForumPostFavoriteMapper;
import com.hongchuang.platform.modules.social.mapper.UserFollowMapper;
import com.hongchuang.platform.modules.social.vo.UserRelationVO;
import com.hongchuang.platform.modules.tag.entity.ForumTag;
import com.hongchuang.platform.modules.tag.service.TagService;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final ForumPostFavoriteMapper forumPostFavoriteMapper;
    private final UserFollowMapper userFollowMapper;
    private final ForumPostMapper forumPostMapper;
    private final ForumBoardMapper forumBoardMapper;
    private final ForumPostTagMapper forumPostTagMapper;
    private final TagService tagService;
    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final NotificationService notificationService;

    @Transactional(rollbackFor = Exception.class)
    public void favoritePost(Long postId) {
        Long userId = requireLogin();
        ForumPost post = requirePost(postId);
        if (post.getUserId().equals(userId)) {
            throw new BusinessException("不能收藏自己的帖子");
        }
        long exists = forumPostFavoriteMapper.selectCount(new LambdaQueryWrapper<ForumPostFavorite>()
                .eq(ForumPostFavorite::getUserId, userId)
                .eq(ForumPostFavorite::getPostId, postId));
        if (exists > 0) {
            return;
        }

        ForumPostFavorite favorite = new ForumPostFavorite();
        favorite.setUserId(userId);
        favorite.setPostId(postId);
        favorite.setDeleted(0);
        forumPostFavoriteMapper.insert(favorite);

        post.setFavoriteCount((post.getFavoriteCount() == null ? 0 : post.getFavoriteCount()) + 1);
        forumPostMapper.updateById(post);
        incrementProfileCounter(userId, "favorite_count", 1);

        notificationService.push(post.getUserId(), "POST_FAVORITE", "帖子被收藏", "你的帖子《" + post.getTitle() + "》被一位用户收藏了。", post.getId(), "POST");
    }

    @Transactional(rollbackFor = Exception.class)
    public void unfavoritePost(Long postId) {
        Long userId = requireLogin();
        ForumPost post = requirePost(postId);
        int affected = forumPostFavoriteMapper.delete(new LambdaQueryWrapper<ForumPostFavorite>()
                .eq(ForumPostFavorite::getUserId, userId)
                .eq(ForumPostFavorite::getPostId, postId));
        if (affected <= 0) {
            return;
        }
        post.setFavoriteCount(Math.max((post.getFavoriteCount() == null ? 0 : post.getFavoriteCount()) - 1, 0));
        forumPostMapper.updateById(post);
        incrementProfileCounter(userId, "favorite_count", -1);
    }

    public PageResult<PostSummaryVO> myFavoritePosts(long pageNo, long pageSize) {
        Long userId = requireLogin();
        Page<ForumPostFavorite> favoritePage = forumPostFavoriteMapper.selectPage(Page.of(pageNo, pageSize),
                new LambdaQueryWrapper<ForumPostFavorite>()
                        .eq(ForumPostFavorite::getUserId, userId)
                        .orderByDesc(ForumPostFavorite::getCreatedAt));
        if (favoritePage.getRecords().isEmpty()) {
            return PageResult.<PostSummaryVO>builder()
                    .list(Collections.emptyList())
                    .total(favoritePage.getTotal())
                    .pageNo(favoritePage.getCurrent())
                    .pageSize(favoritePage.getSize())
                    .build();
        }
        List<PostSummaryVO> list = favoritePage.getRecords().stream()
                .map(ForumPostFavorite::getPostId)
                .map(this::safeGetPost)
                .filter(post -> post != null && post.getStatus() != null && post.getStatus() == 1)
                .map(this::toSummaryVO)
                .toList();
        return PageResult.<PostSummaryVO>builder()
                .list(list)
                .total(favoritePage.getTotal())
                .pageNo(favoritePage.getCurrent())
                .pageSize(favoritePage.getSize())
                .build();
    }

    @Transactional(rollbackFor = Exception.class)
    public void followUser(Long targetUserId) {
        Long userId = requireLogin();
        if (userId.equals(targetUserId)) {
            throw new BusinessException("不能关注自己");
        }
        SysUser targetUser = sysUserMapper.selectById(targetUserId);
        if (targetUser == null || (targetUser.getDeleted() != null && targetUser.getDeleted() == 1)) {
            throw new BusinessException("目标用户不存在");
        }
        long exists = userFollowMapper.selectCount(new LambdaQueryWrapper<UserFollow>()
                .eq(UserFollow::getFollowerUserId, userId)
                .eq(UserFollow::getFolloweeUserId, targetUserId));
        if (exists > 0) {
            return;
        }
        UserFollow item = new UserFollow();
        item.setFollowerUserId(userId);
        item.setFolloweeUserId(targetUserId);
        item.setDeleted(0);
        userFollowMapper.insert(item);

        incrementProfileCounter(userId, "following_count", 1);
        incrementProfileCounter(targetUserId, "follower_count", 1);

        SysUserProfile followerProfile = getProfile(userId);
        String followerName = followerProfile == null || followerProfile.getNickname() == null
                ? (sysUserMapper.selectById(userId) == null ? "一位用户" : sysUserMapper.selectById(userId).getUsername())
                : followerProfile.getNickname();
        notificationService.push(targetUserId, "USER_FOLLOW", "新增关注者", followerName + " 关注了你。", userId, "USER");
    }

    @Transactional(rollbackFor = Exception.class)
    public void unfollowUser(Long targetUserId) {
        Long userId = requireLogin();
        int affected = userFollowMapper.delete(new LambdaQueryWrapper<UserFollow>()
                .eq(UserFollow::getFollowerUserId, userId)
                .eq(UserFollow::getFolloweeUserId, targetUserId));
        if (affected <= 0) {
            return;
        }
        incrementProfileCounter(userId, "following_count", -1);
        incrementProfileCounter(targetUserId, "follower_count", -1);
    }

    public List<UserRelationVO> myFollowingList() {
        Long userId = requireLogin();
        return userFollowMapper.selectList(new LambdaQueryWrapper<UserFollow>()
                        .eq(UserFollow::getFollowerUserId, userId)
                        .orderByDesc(UserFollow::getCreatedAt)
                        .last("limit 200"))
                .stream()
                .map(UserFollow::getFolloweeUserId)
                .map(targetId -> toRelationVO(targetId, userId))
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    public List<UserRelationVO> myFollowerList() {
        Long userId = requireLogin();
        return userFollowMapper.selectList(new LambdaQueryWrapper<UserFollow>()
                        .eq(UserFollow::getFolloweeUserId, userId)
                        .orderByDesc(UserFollow::getCreatedAt)
                        .last("limit 200"))
                .stream()
                .map(UserFollow::getFollowerUserId)
                .map(targetId -> toRelationVO(targetId, userId))
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    public boolean hasFavorited(Long userId, Long postId) {
        if (userId == null || postId == null) {
            return false;
        }
        return forumPostFavoriteMapper.selectCount(new LambdaQueryWrapper<ForumPostFavorite>()
                .eq(ForumPostFavorite::getUserId, userId)
                .eq(ForumPostFavorite::getPostId, postId)) > 0;
    }

    public boolean hasFollowed(Long currentUserId, Long targetUserId) {
        if (currentUserId == null || targetUserId == null || currentUserId.equals(targetUserId)) {
            return false;
        }
        return userFollowMapper.selectCount(new LambdaQueryWrapper<UserFollow>()
                .eq(UserFollow::getFollowerUserId, currentUserId)
                .eq(UserFollow::getFolloweeUserId, targetUserId)) > 0;
    }

    private Long requireLogin() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        return userId;
    }

    private ForumPost requirePost(Long postId) {
        ForumPost post = forumPostMapper.selectById(postId);
        if (post == null || (post.getDeleted() != null && post.getDeleted() == 1)) {
            throw new BusinessException("帖子不存在");
        }
        return post;
    }

    private ForumPost safeGetPost(Long postId) {
        try {
            return requirePost(postId);
        } catch (Exception ignored) {
            return null;
        }
    }

    private void incrementProfileCounter(Long userId, String columnName, int delta) {
        sysUserProfileMapper.update(null, new LambdaUpdateWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId)
                .setSql(columnName + " = GREATEST(COALESCE(" + columnName + ", 0) + " + delta + ", 0)"));
    }

    private SysUserProfile getProfile(Long userId) {
        return sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId)
                .last("limit 1"));
    }

    private PostSummaryVO toSummaryVO(ForumPost post) {
        ForumBoard board = forumBoardMapper.selectById(post.getBoardId());
        SysUserProfile profile = getProfile(post.getUserId());
        SysUser user = sysUserMapper.selectById(post.getUserId());
        List<PostSummaryVO.TagVO> tags = forumPostTagMapper.selectList(new LambdaQueryWrapper<ForumPostTag>()
                        .eq(ForumPostTag::getPostId, post.getId()))
                .stream()
                .map(link -> tagService.getById(link.getTagId()))
                .filter(java.util.Objects::nonNull)
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
                .boardName(board == null ? "未知板块" : board.getName())
                .likeCount(post.getLikeCount())
                .favoriteCount(post.getFavoriteCount())
                .commentCount(post.getCommentCount())
                .createdAt(post.getCreatedAt())
                .tags(tags)
                .build();
    }

    private UserRelationVO toRelationVO(Long targetUserId, Long currentUserId) {
        SysUser user = sysUserMapper.selectById(targetUserId);
        if (user == null || (user.getDeleted() != null && user.getDeleted() == 1)) {
            return null;
        }
        SysUserProfile profile = getProfile(targetUserId);
        return UserRelationVO.builder()
                .userId(user.getId())
                .forumUid(user.getForumUid())
                .username(user.getUsername())
                .nickname(profile == null || profile.getNickname() == null ? user.getUsername() : profile.getNickname())
                .avatarUrl(profile == null ? null : profile.getAvatarUrl())
                .signature(profile == null ? null : profile.getSignature())
                .businessCard(profile == null ? null : profile.getBusinessCard())
                .userLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                .postCount(profile == null || profile.getPostCount() == null ? 0 : profile.getPostCount())
                .commentCount(profile == null || profile.getCommentCount() == null ? 0 : profile.getCommentCount())
                .followerCount(profile == null || profile.getFollowerCount() == null ? 0 : profile.getFollowerCount())
                .followingCount(profile == null || profile.getFollowingCount() == null ? 0 : profile.getFollowingCount())
                .followedByMe(hasFollowed(currentUserId, targetUserId))
                .build();
    }
}
