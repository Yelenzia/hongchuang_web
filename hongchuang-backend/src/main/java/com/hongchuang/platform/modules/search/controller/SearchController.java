package com.hongchuang.platform.modules.search.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.search.service.SearchService;
import com.hongchuang.platform.modules.search.vo.SearchOverviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public Result<SearchOverviewVO> search(@RequestParam String keyword,
                                           @RequestParam(required = false) Integer postLimit,
                                           @RequestParam(required = false) Integer resourceLimit,
                                           @RequestParam(required = false) Integer userLimit) {
        return Result.success(searchService.search(keyword, postLimit, resourceLimit, userLimit));
    }
}
