package com.hongchuang.platform.modules.content.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.content.service.ContentTemplateService;
import com.hongchuang.platform.modules.content.vo.ContentTemplateVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content-templates")
@RequiredArgsConstructor
public class ContentTemplateController {

    private final ContentTemplateService contentTemplateService;

    @GetMapping
    public Result<List<ContentTemplateVO>> list(@RequestParam(required = false) String templateType,
                                                @RequestParam(required = false) String sceneCode) {
        return Result.success(contentTemplateService.listEnabled(templateType, sceneCode));
    }
}
