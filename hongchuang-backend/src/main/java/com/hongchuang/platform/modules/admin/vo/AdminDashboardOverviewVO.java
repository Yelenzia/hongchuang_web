package com.hongchuang.platform.modules.admin.vo;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminDashboardOverviewVO {
    private Long userCount;
    private Long todayUserCount;
    private Long postCount;
    private Long todayPostCount;
    private Long commentCount;
    private Long todayCommentCount;
    private Long resourceCount;
    private Long todayResourceCount;
    private Long privateMessageCount;
    private Long todayLoginCount;
    private Long activeSessionCount;
    private Long pendingReportCount;
    private Long pendingAnnouncementCount;
    private List<String> todoItems;
    private List<AdminDashboardTrendPointVO> userTrend;
    private List<AdminDashboardTrendPointVO> postTrend;
    private List<AdminDashboardTrendPointVO> resourceTrend;
    private List<AdminDashboardRankItemVO> topBoards;
    private List<AdminDashboardRankItemVO> topTags;
    private List<AdminDashboardRankItemVO> hotResources;
}
