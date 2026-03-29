package com.hongchuang.platform.modules.admin.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.tag.dto.TagSaveRequest;
import com.hongchuang.platform.modules.tag.entity.ForumTag;
import com.hongchuang.platform.modules.tag.service.TagService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/tags")
public class AdminTagController {

    private final TagService tagService;

    public AdminTagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public Result<List<ForumTag>> list() {
        return Result.success(tagService.listAll());
    }

    @PostMapping
    public Result<?> create(@Valid @RequestBody TagSaveRequest request) {
        return Result.success("创建成功", Map.of("tagId", tagService.create(request)));
    }

    @PutMapping("/{tagId}")
    public Result<Void> update(@PathVariable Long tagId, @Valid @RequestBody TagSaveRequest request) {
        tagService.update(tagId, request);
        return Result.success("更新成功", null);
    }

    @DeleteMapping("/{tagId}")
    public Result<Void> delete(@PathVariable Long tagId) {
        tagService.delete(tagId);
        return Result.success("删除成功", null);
    }
}
