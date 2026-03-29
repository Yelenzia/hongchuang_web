package com.hongchuang.platform.modules.site.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.site.service.SitePageService;
import com.hongchuang.platform.modules.site.vo.SitePageVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/site-pages")
@RequiredArgsConstructor
public class SitePageController {

    private final SitePageService sitePageService;

    @GetMapping("/{pageCode}")
    public Result<SitePageVO> detail(@PathVariable String pageCode) {
        return Result.success(sitePageService.detailByCode(pageCode));
    }
}
