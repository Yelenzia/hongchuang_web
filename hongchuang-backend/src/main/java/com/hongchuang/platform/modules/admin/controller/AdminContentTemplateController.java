package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.content.dto.TemplateSaveRequest;
import com.hongchuang.platform.modules.content.entity.ContentTemplate;
import com.hongchuang.platform.modules.content.service.ContentTemplateService;
import com.hongchuang.platform.modules.content.vo.ContentTemplateVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/content-templates")
@RequiredArgsConstructor
public class AdminContentTemplateController {

    private final ContentTemplateService contentTemplateService;

    @GetMapping
    public Result<Page<ContentTemplate>> page(@RequestParam(defaultValue = "1") long pageNo,
                                              @RequestParam(defaultValue = "10") long pageSize,
                                              @RequestParam(required = false) String templateType,
                                              @RequestParam(required = false) String keyword,
                                              @RequestParam(required = false) Integer enabled) {
        return Result.success(contentTemplateService.pageAdmin(pageNo, pageSize, templateType, keyword, enabled));
    }

    @GetMapping("/{id}")
    public Result<ContentTemplateVO> detail(@PathVariable Long id) {
        return Result.success(contentTemplateService.detail(id));
    }

    @PostMapping
    public Result<Map<String, Object>> create(@Valid @RequestBody TemplateSaveRequest request) {
        Long id = contentTemplateService.create(request);
        return Result.success("模板创建成功", Map.of("id", id));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody TemplateSaveRequest request) {
        contentTemplateService.update(id, request);
        return Result.success("模板更新成功", null);
    }

    @PatchMapping("/{id}/enabled")
    public Result<Void> updateEnabled(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        contentTemplateService.updateEnabled(id, request.getOrDefault("enabled", 1));
        return Result.success("模板状态已更新", null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        contentTemplateService.delete(id);
        return Result.success("模板已删除", null);
    }
}
