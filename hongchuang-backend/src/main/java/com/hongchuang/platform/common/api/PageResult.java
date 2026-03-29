package com.hongchuang.platform.common.api;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PageResult<T> {
    private List<T> list;
    private Long total;
    private Long pageNo;
    private Long pageSize;
}
