package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.comment.entity.ForumComment;
import com.hongchuang.platform.modules.comment.mapper.ForumCommentMapper;
import com.hongchuang.platform.modules.comment.service.CommentService;
import com.hongchuang.platform.modules.post.entity.ForumPost;
import com.hongchuang.platform.modules.post.mapper.ForumPostMapper;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/comments")
public class AdminCommentController {

    private final ForumCommentMapper forumCommentMapper;
    private final CommentService commentService;
    private final ForumPostMapper forumPostMapper;
    private final SysUserProfileMapper sysUserProfileMapper;

    public AdminCommentController(ForumCommentMapper forumCommentMapper,
                                  CommentService commentService,
                                  ForumPostMapper forumPostMapper,
                                  SysUserProfileMapper sysUserProfileMapper) {
        this.forumCommentMapper = forumCommentMapper;
        this.commentService = commentService;
        this.forumPostMapper = forumPostMapper;
        this.sysUserProfileMapper = sysUserProfileMapper;
    }

    @GetMapping
    public Result<Page<Map<String, Object>>> page(@RequestParam(defaultValue = "1") long pageNo,
                                                  @RequestParam(defaultValue = "10") long pageSize,
                                                  @RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<ForumComment> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(keyword)) {
            wrapper.like(ForumComment::getContent, keyword);
        }
        wrapper.orderByDesc(ForumComment::getCreatedAt);
        Page<ForumComment> page = forumCommentMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
        Page<Map<String, Object>> result = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        result.setRecords(page.getRecords().stream().map(comment -> {
            ForumPost post = forumPostMapper.selectById(comment.getPostId());
            SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                    .eq(SysUserProfile::getUserId, comment.getUserId())
                    .last("limit 1"));
            Map<String, Object> map = new HashMap<>();
            map.put("id", comment.getId());
            map.put("postId", comment.getPostId());
            map.put("postTitle", post == null ? "已删除帖子" : post.getTitle());
            map.put("authorId", comment.getUserId());
            map.put("author", profile == null ? "用户" : profile.getNickname());
            map.put("content", comment.getContent());
            map.put("status", comment.getStatus());
            map.put("createdAt", comment.getCreatedAt());
            return map;
        }).toList());
        return Result.success(result);
    }

    @DeleteMapping("/{commentId}")
    public Result<Void> delete(@PathVariable Long commentId) {
        commentService.deleteOwnOrAdmin(commentId, true);
        return Result.success("评论删除成功", null);
    }
}
