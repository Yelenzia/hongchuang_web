package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.board.entity.ForumBoard;
import com.hongchuang.platform.modules.board.mapper.ForumBoardMapper;
import com.hongchuang.platform.modules.post.dto.UpdatePostRequest;
import com.hongchuang.platform.modules.post.entity.ForumPost;
import com.hongchuang.platform.modules.post.service.PostService;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/posts")
public class AdminPostController {

    private final PostService postService;
    private final ForumBoardMapper forumBoardMapper;
    private final SysUserProfileMapper sysUserProfileMapper;

    public AdminPostController(PostService postService,
                               ForumBoardMapper forumBoardMapper,
                               SysUserProfileMapper sysUserProfileMapper) {
        this.postService = postService;
        this.forumBoardMapper = forumBoardMapper;
        this.sysUserProfileMapper = sysUserProfileMapper;
    }

    @GetMapping
    public Result<Page<Map<String, Object>>> page(@RequestParam(defaultValue = "1") long pageNo,
                                                  @RequestParam(defaultValue = "10") long pageSize,
                                                  @RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) Integer status) {
        Page<ForumPost> page = postService.pageAdmin(pageNo, pageSize, keyword, status);
        Page<Map<String, Object>> result = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        result.setRecords(page.getRecords().stream().map(post -> {
            ForumBoard board = forumBoardMapper.selectById(post.getBoardId());
            SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                    .eq(SysUserProfile::getUserId, post.getUserId())
                    .last("limit 1"));
            Map<String, Object> map = new HashMap<>();
            map.put("id", post.getId());
            map.put("title", post.getTitle());
            map.put("summary", post.getSummary());
            map.put("authorId", post.getUserId());
            map.put("author", profile == null ? "用户" : profile.getNickname());
            map.put("boardId", post.getBoardId());
            map.put("board", board == null ? "未知板块" : board.getName());
            map.put("status", post.getStatus());
            map.put("isRecommended", post.getIsRecommended());
            map.put("likeCount", post.getLikeCount());
            map.put("commentCount", post.getCommentCount());
            map.put("createdAt", post.getCreatedAt());
            return map;
        }).toList());
        return Result.success(result);
    }

    @PutMapping("/{postId}")
    public Result<Void> update(@PathVariable Long postId, @Valid @RequestBody UpdatePostRequest request) {
        postService.update(postId, request, true);
        return Result.success("帖子更新成功", null);
    }

    @DeleteMapping("/{postId}")
    public Result<Void> delete(@PathVariable Long postId) {
        postService.delete(postId, true);
        return Result.success("帖子删除成功", null);
    }

    @PatchMapping("/{postId}/recommend")
    public Result<Void> recommend(@PathVariable Long postId, @RequestBody Map<String, Boolean> request) {
        postService.recommend(postId, Boolean.TRUE.equals(request.get("recommended")));
        return Result.success("推荐状态已更新", null);
    }

    @PatchMapping("/{postId}/status")
    public Result<Void> updateStatus(@PathVariable Long postId, @RequestBody Map<String, Integer> request) {
        postService.updateStatus(postId, request.getOrDefault("status", 1));
        return Result.success("帖子状态已更新", null);
    }
}
