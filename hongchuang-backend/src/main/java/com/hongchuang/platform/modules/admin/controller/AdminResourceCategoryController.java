package com.hongchuang.platform.modules.admin.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.resource.dto.ResourceCategorySaveRequest;
import com.hongchuang.platform.modules.resource.dto.ResourceCategoryStatusUpdateRequest;
import com.hongchuang.platform.modules.resource.service.ResourceCategoryService;
import com.hongchuang.platform.modules.resource.vo.ResourceCategoryVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/resource-categories")
@RequiredArgsConstructor
public class AdminResourceCategoryController {

    private final ResourceCategoryService resourceCategoryService;

    @GetMapping
    public Result<List<ResourceCategoryVO>> list() {
        return Result.success(resourceCategoryService.listAll());
    }

    @PostMapping
    public Result<Map<String, Object>> create(@Valid @RequestBody ResourceCategorySaveRequest request) {
        return Result.success("创建成功", Map.of("categoryId", resourceCategoryService.create(request)));
    }

    @PutMapping("/{categoryId}")
    public Result<Void> update(@PathVariable Long categoryId, @Valid @RequestBody ResourceCategorySaveRequest request) {
        resourceCategoryService.update(categoryId, request);
        return Result.success("更新成功", null);
    }

    @PatchMapping("/{categoryId}/status")
    public Result<Void> updateStatus(@PathVariable Long categoryId, @Valid @RequestBody ResourceCategoryStatusUpdateRequest request) {
        resourceCategoryService.updateStatus(categoryId, request.getStatus());
        return Result.success("状态已更新", null);
    }

    @DeleteMapping("/{categoryId}")
    public Result<Void> delete(@PathVariable Long categoryId) {
        resourceCategoryService.delete(categoryId);
        return Result.success("删除成功", null);
    }
}
