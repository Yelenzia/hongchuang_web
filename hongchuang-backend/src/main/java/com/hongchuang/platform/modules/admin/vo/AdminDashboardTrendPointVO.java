package com.hongchuang.platform.modules.admin.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardTrendPointVO {
    private String date;
    private Long value;
}
