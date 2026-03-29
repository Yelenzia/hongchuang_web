package com.hongchuang.platform.modules.tag.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.tag.entity.ForumTag;
import com.hongchuang.platform.modules.tag.service.TagService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public Result<List<ForumTag>> list() {
        return Result.success(tagService.listAllEnabled());
    }

    @GetMapping("/hot")
    public Result<List<ForumTag>> hot() {
        return Result.success(tagService.listHot());
    }
}
