package com.hongchuang.platform.modules.search.service;

import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.modules.post.dto.PostQueryRequest;
import com.hongchuang.platform.modules.post.service.PostService;
import com.hongchuang.platform.modules.resource.dto.ResourceQueryRequest;
import com.hongchuang.platform.modules.resource.service.ResourceService;
import com.hongchuang.platform.modules.search.vo.SearchOverviewVO;
import com.hongchuang.platform.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final PostService postService;
    private final ResourceService resourceService;
    private final UserService userService;

    public SearchOverviewVO search(String keyword, Integer postLimit, Integer resourceLimit, Integer userLimit) {
        String normalizedKeyword = StringUtils.trimToEmpty(keyword);
        if (normalizedKeyword.length() < 1) {
            throw new BusinessException("请输入搜索关键词");
        }

        PostQueryRequest postQueryRequest = new PostQueryRequest();
        postQueryRequest.setPageNo(1L);
        postQueryRequest.setPageSize(Long.valueOf(limit(postLimit, 6, 12)));
        postQueryRequest.setKeyword(normalizedKeyword);
        PageResult<com.hongchuang.platform.modules.post.vo.PostSummaryVO> postPage = postService.page(postQueryRequest);

        ResourceQueryRequest resourceQueryRequest = new ResourceQueryRequest();
        resourceQueryRequest.setPageNo(1L);
        resourceQueryRequest.setPageSize(Long.valueOf(limit(resourceLimit, 6, 12)));
        resourceQueryRequest.setKeyword(normalizedKeyword);
        PageResult<com.hongchuang.platform.modules.resource.vo.ResourceCardVO> resourcePage = resourceService.page(resourceQueryRequest);

        var users = userService.searchUsers(normalizedKeyword, limit(userLimit, 8, 12));

        return SearchOverviewVO.builder()
                .keyword(normalizedKeyword)
                .postTotal(postPage.getTotal())
                .resourceTotal(resourcePage.getTotal())
                .userTotal((long) users.size())
                .posts(postPage.getList())
                .resources(resourcePage.getList())
                .users(users)
                .build();
    }

    private int limit(Integer value, int defaultValue, int maxValue) {
        if (value == null || value <= 0) {
            return defaultValue;
        }
        return Math.min(value, maxValue);
    }
}
