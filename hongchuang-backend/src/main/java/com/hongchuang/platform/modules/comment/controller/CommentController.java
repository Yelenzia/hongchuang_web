package com.hongchuang.platform.modules.comment.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.comment.dto.CreateCommentRequest;
import com.hongchuang.platform.modules.comment.service.CommentService;
import com.hongchuang.platform.modules.comment.vo.CommentVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/posts/{postId}/comments")
    public Result<List<CommentVO>> list(@PathVariable Long postId) {
        return Result.success(commentService.listByPostId(postId));
    }

    @PostMapping("/posts/{postId}/comments")
    public Result<?> create(@PathVariable Long postId, @Valid @RequestBody CreateCommentRequest request) {
        return Result.success("评论成功", java.util.Map.of("commentId", commentService.create(postId, request)));
    }

    @DeleteMapping("/comments/{commentId}")
    public Result<Void> delete(@PathVariable Long commentId) {
        commentService.deleteOwnOrAdmin(commentId, false);
        return Result.success("评论删除成功", null);
    }
}
