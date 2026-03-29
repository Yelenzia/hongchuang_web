package com.hongchuang.platform.modules.search.vo;

import com.hongchuang.platform.modules.post.vo.PostSummaryVO;
import com.hongchuang.platform.modules.resource.vo.ResourceCardVO;
import com.hongchuang.platform.modules.user.vo.UserSearchVO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SearchOverviewVO {
    private String keyword;
    private Long postTotal;
    private Long resourceTotal;
    private Long userTotal;
    private List<PostSummaryVO> posts;
    private List<ResourceCardVO> resources;
    private List<UserSearchVO> users;
}
