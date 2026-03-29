package com.hongchuang.platform.modules.post.controller;

import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.post.dto.CreatePostRequest;
import com.hongchuang.platform.modules.post.dto.PostQueryRequest;
import com.hongchuang.platform.modules.post.dto.UpdatePostRequest;
import com.hongchuang.platform.modules.post.service.PostService;
import com.hongchuang.platform.modules.post.vo.PostDetailVO;
import com.hongchuang.platform.modules.post.vo.PostSummaryVO;
import com.hongchuang.platform.modules.social.service.SocialService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;
    private final SocialService socialService;

    public PostController(PostService postService, SocialService socialService) {
        this.postService = postService;
        this.socialService = socialService;
    }

    @PostMapping
    public Result<?> create(@Valid @RequestBody CreatePostRequest request) {
        return Result.success("发帖成功", java.util.Map.of("postId", postService.create(request)));
    }

    @GetMapping
    public Result<PageResult<PostSummaryVO>> page(PostQueryRequest request) {
        return Result.success(postService.page(request));
    }

    @GetMapping("/favorites/me")
    public Result<PageResult<PostSummaryVO>> myFavorites(@RequestParam(defaultValue = "1") long pageNo,
                                                         @RequestParam(defaultValue = "10") long pageSize) {
        return Result.success(socialService.myFavoritePosts(pageNo, pageSize));
    }

    @GetMapping("/{postId}")
    public Result<PostDetailVO> detail(@PathVariable Long postId) {
        return Result.success(postService.detail(postId));
    }

    @PutMapping("/{postId}")
    public Result<Void> update(@PathVariable Long postId, @Valid @RequestBody UpdatePostRequest request) {
        postService.update(postId, request, false);
        return Result.success("帖子更新成功", null);
    }

    @DeleteMapping("/{postId}")
    public Result<Void> delete(@PathVariable Long postId) {
        postService.delete(postId, false);
        return Result.success("帖子删除成功", null);
    }

    @PostMapping("/{postId}/like")
    public Result<Void> like(@PathVariable Long postId) {
        postService.like(postId);
        return Result.success("点赞成功", null);
    }

    @DeleteMapping("/{postId}/like")
    public Result<Void> unlike(@PathVariable Long postId) {
        postService.unlike(postId);
        return Result.success("取消点赞成功", null);
    }

    @PostMapping("/{postId}/favorite")
    public Result<Void> favorite(@PathVariable Long postId) {
        socialService.favoritePost(postId);
        return Result.success("收藏成功", null);
    }

    @DeleteMapping("/{postId}/favorite")
    public Result<Void> unfavorite(@PathVariable Long postId) {
        socialService.unfavoritePost(postId);
        return Result.success("取消收藏成功", null);
    }

    @PostMapping("/{postId}/block")
    public Result<Void> block(@PathVariable Long postId) {
        postService.block(postId);
        return Result.success("已屏蔽该帖子", null);
    }

    @DeleteMapping("/{postId}/block")
    public Result<Void> unblock(@PathVariable Long postId) {
        postService.unblock(postId);
        return Result.success("已取消屏蔽", null);
    }
}
