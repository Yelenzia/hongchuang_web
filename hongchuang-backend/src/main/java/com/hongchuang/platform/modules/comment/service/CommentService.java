package com.hongchuang.platform.modules.comment.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.achievement.service.AchievementService;
import com.hongchuang.platform.modules.comment.dto.CreateCommentRequest;
import com.hongchuang.platform.modules.comment.entity.ForumComment;
import com.hongchuang.platform.modules.comment.mapper.ForumCommentMapper;
import com.hongchuang.platform.modules.comment.vo.CommentVO;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import com.hongchuang.platform.modules.post.entity.ForumPost;
import com.hongchuang.platform.modules.post.mapper.ForumPostMapper;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import com.hongchuang.platform.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CommentService {

    private static final Pattern MENTION_PATTERN = Pattern.compile("@([A-Za-z0-9_\\-\\u4e00-\\u9fa5]{2,32})");

    private final ForumCommentMapper forumCommentMapper;
    private final ForumPostMapper forumPostMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final SysUserMapper sysUserMapper;
    private final UserService userService;
    private final AchievementService achievementService;
    private final NotificationService notificationService;

    public List<CommentVO> listByPostId(Long postId) {
        List<ForumComment> comments = forumCommentMapper.selectList(new LambdaQueryWrapper<ForumComment>()
                .eq(ForumComment::getPostId, postId)
                .eq(ForumComment::getStatus, 1)
                .orderByAsc(ForumComment::getCreatedAt));
        return comments.stream().map(this::toVO).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public Long create(Long postId, CreateCommentRequest request) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(401, "未登录");
        }
        ForumPost post = forumPostMapper.selectById(postId);
        if (post == null || post.getStatus() == null || post.getStatus() != 1) {
            throw new BusinessException("帖子不存在或不可评论");
        }

        Long parentId = request.getParentId() == null ? 0L : request.getParentId();
        ForumComment parent = null;
        if (parentId != 0L) {
            parent = forumCommentMapper.selectById(parentId);
            if (parent == null || !postId.equals(parent.getPostId())) {
                throw new BusinessException("回复目标不存在");
            }
        }

        String cleanContent = SanitizeUtils.cleanText(request.getContent());
        ForumComment comment = new ForumComment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setParentId(parentId);
        comment.setRootId(parent == null ? 0L : (parent.getRootId() == null || parent.getRootId() == 0L ? parent.getId() : parent.getRootId()));
        comment.setReplyUserId(request.getReplyUserId() != null ? request.getReplyUserId() : (parent == null ? null : parent.getUserId()));
        comment.setContent(cleanContent);
        comment.setStatus(1);
        forumCommentMapper.insert(comment);

        post.setCommentCount((post.getCommentCount() == null ? 0 : post.getCommentCount()) + 1);
        forumPostMapper.updateById(post);
        userService.incrementCommentCount(userId, 1);
        userService.addExperience(userId, 6);
        achievementService.evaluateMilestones(userId);

        Set<Long> notifiedUserIds = new HashSet<>();
        if (parent != null && !parent.getUserId().equals(userId)) {
            notificationService.push(parent.getUserId(), "COMMENT_REPLY", "收到评论回复", "你在帖子《" + post.getTitle() + "》中的评论收到了新回复。", postId, "POST");
            notifiedUserIds.add(parent.getUserId());
        } else if (!post.getUserId().equals(userId)) {
            notificationService.push(post.getUserId(), "POST_COMMENT", "帖子收到新评论", "你发布的帖子《" + post.getTitle() + "》收到了新的评论。", postId, "POST");
            notifiedUserIds.add(post.getUserId());
        }

        for (Long mentionedUserId : resolveMentionedUserIds(cleanContent)) {
            if (mentionedUserId.equals(userId) || notifiedUserIds.contains(mentionedUserId)) {
                continue;
            }
            notificationService.push(mentionedUserId, "COMMENT_MENTION", "你被提到了", "有人在帖子《" + post.getTitle() + "》的评论中 @了你。", postId, "POST");
            notifiedUserIds.add(mentionedUserId);
        }
        return comment.getId();
    }

    public void deleteOwnOrAdmin(Long commentId, boolean adminMode) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        ForumComment comment = forumCommentMapper.selectById(commentId);
        if (comment == null) {
            throw new BusinessException("评论不存在");
        }
        if (!adminMode && !comment.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权删除该评论");
        }
        if (comment.getDeleted() != null && comment.getDeleted() == 1) {
            return;
        }
        forumCommentMapper.deleteById(commentId);

        ForumPost post = forumPostMapper.selectById(comment.getPostId());
        if (post != null) {
            post.setCommentCount(Math.max((post.getCommentCount() == null ? 0 : post.getCommentCount()) - 1, 0));
            forumPostMapper.updateById(post);
        }
        userService.incrementCommentCount(comment.getUserId(), -1);
    }

    private Set<Long> resolveMentionedUserIds(String content) {
        Set<Long> userIds = new HashSet<>();
        Matcher matcher = MENTION_PATTERN.matcher(content == null ? "" : content);
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

    private CommentVO toVO(ForumComment comment) {
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, comment.getUserId()).last("limit 1"));
        SysUser user = sysUserMapper.selectById(comment.getUserId());

        String replyNickname = null;
        Long replyForumUid = null;
        if (comment.getReplyUserId() != null) {
            SysUserProfile replyProfile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                    .eq(SysUserProfile::getUserId, comment.getReplyUserId()).last("limit 1"));
            SysUser replyUser = sysUserMapper.selectById(comment.getReplyUserId());
            replyNickname = replyProfile == null ? null : replyProfile.getNickname();
            replyForumUid = replyUser == null ? null : replyUser.getForumUid();
        }

        return CommentVO.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
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
                .build();
    }
}
