package com.hongchuang.platform.modules.resource.controller;

import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.resource.dto.CreateResourceCommentRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceQueryRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceSaveRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceStatusUpdateRequest;
import com.hongchuang.platform.modules.resource.service.ResourceService;
import com.hongchuang.platform.modules.resource.vo.ResourceCardVO;
import com.hongchuang.platform.modules.resource.vo.ResourceCommentVO;
import com.hongchuang.platform.modules.resource.vo.ResourceDetailVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public Result<PageResult<ResourceCardVO>> page(ResourceQueryRequest request) {
        return Result.success(resourceService.page(request));
    }

    @GetMapping("/recommend")
    public Result<List<ResourceCardVO>> recommend(@RequestParam(defaultValue = "6") Integer size) {
        return Result.success(resourceService.recommend(size));
    }

    @GetMapping("/me")
    public Result<PageResult<ResourceCardVO>> myResources(@RequestParam(defaultValue = "1") long pageNo,
                                                          @RequestParam(defaultValue = "10") long pageSize,
                                                          @RequestParam(required = false) Integer status) {
        return Result.success(resourceService.myResources(pageNo, pageSize, status));
    }

    @PostMapping
    public Result<Map<String, Object>> create(@Valid @RequestBody ResourceSaveRequest request) {
        Long resourceId = resourceService.create(request);
        return Result.success("资源保存成功", Map.of("resourceId", resourceId));
    }

    @PutMapping("/{resourceId}")
    public Result<Void> update(@PathVariable Long resourceId, @Valid @RequestBody ResourceSaveRequest request) {
        resourceService.update(resourceId, request);
        return Result.success("资源更新成功", null);
    }

    @PostMapping("/{resourceId}/submit-audit")
    public Result<Void> submitAudit(@PathVariable Long resourceId) {
        resourceService.submitAudit(resourceId);
        return Result.success("已提交审核", null);
    }

    @PatchMapping("/{resourceId}/status")
    public Result<Void> updateStatus(@PathVariable Long resourceId, @Valid @RequestBody ResourceStatusUpdateRequest request) {
        resourceService.changeOwnStatus(resourceId, request.getStatus());
        return Result.success("资源状态已更新", null);
    }

    @GetMapping("/{resourceId}")
    public Result<ResourceDetailVO> detail(@PathVariable Long resourceId) {
        return Result.success(resourceService.detail(resourceId));
    }

    @PostMapping("/{resourceId}/favorite")
    public Result<Void> favorite(@PathVariable Long resourceId) {
        resourceService.favorite(resourceId);
        return Result.success("收藏成功", null);
    }

    @DeleteMapping("/{resourceId}/favorite")
    public Result<Void> unfavorite(@PathVariable Long resourceId) {
        resourceService.unfavorite(resourceId);
        return Result.success("已取消收藏", null);
    }

    @PostMapping("/{resourceId}/like")
    public Result<Void> like(@PathVariable Long resourceId) {
        resourceService.like(resourceId);
        return Result.success("点赞成功", null);
    }

    @DeleteMapping("/{resourceId}/like")
    public Result<Void> unlike(@PathVariable Long resourceId) {
        resourceService.unlike(resourceId);
        return Result.success("已取消点赞", null);
    }

    @PostMapping("/{resourceId}/download")
    public Result<Map<String, String>> download(@PathVariable Long resourceId,
                                                jakarta.servlet.http.HttpServletRequest request) {
        return Result.success(resourceService.download(resourceId, request));
    }

    @GetMapping("/{resourceId}/comments")
    public Result<List<ResourceCommentVO>> comments(@PathVariable Long resourceId) {
        return Result.success(resourceService.comments(resourceId));
    }

    @PostMapping("/{resourceId}/comments")
    public Result<Map<String, Object>> createComment(@PathVariable Long resourceId,
                                                     @Valid @RequestBody CreateResourceCommentRequest request) {
        Long commentId = resourceService.createComment(resourceId, request);
        return Result.success("评论成功", Map.of("commentId", commentId));
    }

    @DeleteMapping("/comments/{commentId}")
    public Result<Void> deleteComment(@PathVariable Long commentId) {
        resourceService.deleteComment(commentId);
        return Result.success("评论已删除", null);
    }
}
