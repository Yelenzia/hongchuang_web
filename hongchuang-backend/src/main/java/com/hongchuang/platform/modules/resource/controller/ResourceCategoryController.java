package com.hongchuang.platform.modules.resource.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.resource.service.ResourceCategoryService;
import com.hongchuang.platform.modules.resource.vo.ResourceCategoryVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resource-categories")
@RequiredArgsConstructor
public class ResourceCategoryController {

    private final ResourceCategoryService resourceCategoryService;

    @GetMapping
    public Result<List<ResourceCategoryVO>> list() {
        return Result.success(resourceCategoryService.listEnabled());
    }
}
