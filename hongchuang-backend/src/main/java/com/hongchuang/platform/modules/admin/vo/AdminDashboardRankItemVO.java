package com.hongchuang.platform.modules.admin.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardRankItemVO {
    private String name;
    private Long value;
    private String extra;
}
