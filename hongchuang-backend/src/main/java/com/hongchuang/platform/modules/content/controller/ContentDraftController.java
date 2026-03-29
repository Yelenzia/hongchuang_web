package com.hongchuang.platform.modules.content.controller;

import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.content.dto.DraftSaveRequest;
import com.hongchuang.platform.modules.content.service.ContentDraftService;
import com.hongchuang.platform.modules.content.vo.ContentDraftVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/drafts")
@RequiredArgsConstructor
public class ContentDraftController {

    private final ContentDraftService contentDraftService;

    @GetMapping
    public Result<PageResult<ContentDraftVO>> myDrafts(@RequestParam(defaultValue = "1") long pageNo,
                                                       @RequestParam(defaultValue = "10") long pageSize,
                                                       @RequestParam(required = false) String draftType) {
        return Result.success(contentDraftService.myDrafts(pageNo, pageSize, draftType));
    }

    @GetMapping("/{draftId}")
    public Result<ContentDraftVO> detail(@PathVariable Long draftId) {
        return Result.success(contentDraftService.detail(draftId));
    }

    @PostMapping
    public Result<Map<String, Object>> save(@Valid @RequestBody DraftSaveRequest request) {
        Long draftId = contentDraftService.save(request);
        return Result.success(request.getId() == null ? "草稿已创建" : "草稿已更新", Map.of("draftId", draftId));
    }

    @DeleteMapping("/{draftId}")
    public Result<Void> delete(@PathVariable Long draftId) {
        contentDraftService.delete(draftId);
        return Result.success("草稿已删除", null);
    }
}
