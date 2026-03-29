package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.admin.vo.AdminDashboardOverviewVO;
import com.hongchuang.platform.modules.admin.vo.AdminDashboardRankItemVO;
import com.hongchuang.platform.modules.admin.vo.AdminDashboardTrendPointVO;
import com.hongchuang.platform.modules.announcement.entity.CmsAnnouncement;
import com.hongchuang.platform.modules.announcement.mapper.CmsAnnouncementMapper;
import com.hongchuang.platform.modules.board.entity.ForumBoard;
import com.hongchuang.platform.modules.board.mapper.ForumBoardMapper;
import com.hongchuang.platform.modules.comment.entity.ForumComment;
import com.hongchuang.platform.modules.comment.mapper.ForumCommentMapper;
import com.hongchuang.platform.modules.notification.entity.PrivateMessage;
import com.hongchuang.platform.modules.notification.mapper.PrivateMessageMapper;
import com.hongchuang.platform.modules.post.entity.ForumPost;
import com.hongchuang.platform.modules.post.mapper.ForumPostMapper;
import com.hongchuang.platform.modules.report.entity.ForumReport;
import com.hongchuang.platform.modules.report.mapper.ForumReportMapper;
import com.hongchuang.platform.modules.resource.entity.ResourceItem;
import com.hongchuang.platform.modules.resource.mapper.ResourceItemMapper;
import com.hongchuang.platform.modules.session.entity.UserLoginSession;
import com.hongchuang.platform.modules.session.mapper.UserLoginSessionMapper;
import com.hongchuang.platform.modules.tag.entity.ForumTag;
import com.hongchuang.platform.modules.tag.mapper.ForumTagMapper;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final SysUserMapper sysUserMapper;
    private final ForumPostMapper forumPostMapper;
    private final ForumCommentMapper forumCommentMapper;
    private final ForumReportMapper forumReportMapper;
    private final CmsAnnouncementMapper cmsAnnouncementMapper;
    private final ResourceItemMapper resourceItemMapper;
    private final PrivateMessageMapper privateMessageMapper;
    private final UserLoginSessionMapper userLoginSessionMapper;
    private final ForumBoardMapper forumBoardMapper;
    private final ForumTagMapper forumTagMapper;

    @GetMapping
    public Result<AdminDashboardOverviewVO> overview() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        long userCount = sysUserMapper.selectCount(new LambdaQueryWrapper<SysUser>().eq(SysUser::getDeleted, 0));
        long todayUserCount = sysUserMapper.selectCount(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getDeleted, 0)
                .ge(SysUser::getCreatedAt, todayStart));

        long postCount = forumPostMapper.selectCount(new LambdaQueryWrapper<ForumPost>().eq(ForumPost::getDeleted, 0));
        long todayPostCount = forumPostMapper.selectCount(new LambdaQueryWrapper<ForumPost>()
                .eq(ForumPost::getDeleted, 0)
                .ge(ForumPost::getCreatedAt, todayStart));

        long commentCount = forumCommentMapper.selectCount(new LambdaQueryWrapper<ForumComment>().eq(ForumComment::getDeleted, 0));
        long todayCommentCount = forumCommentMapper.selectCount(new LambdaQueryWrapper<ForumComment>()
                .eq(ForumComment::getDeleted, 0)
                .ge(ForumComment::getCreatedAt, todayStart));

        long resourceCount = resourceItemMapper.selectCount(new LambdaQueryWrapper<ResourceItem>().eq(ResourceItem::getDeleted, 0));
        long todayResourceCount = resourceItemMapper.selectCount(new LambdaQueryWrapper<ResourceItem>()
                .eq(ResourceItem::getDeleted, 0)
                .ge(ResourceItem::getCreatedAt, todayStart));

        long privateMessageCount = privateMessageMapper.selectCount(new LambdaQueryWrapper<PrivateMessage>().eq(PrivateMessage::getDeleted, 0));
        long todayLoginCount = userLoginSessionMapper.selectCount(new LambdaQueryWrapper<UserLoginSession>()
                .eq(UserLoginSession::getDeleted, 0)
                .ge(UserLoginSession::getCreatedAt, todayStart));
        long activeSessionCount = userLoginSessionMapper.selectCount(new LambdaQueryWrapper<UserLoginSession>()
                .eq(UserLoginSession::getDeleted, 0)
                .eq(UserLoginSession::getStatus, 1)
                .ge(UserLoginSession::getExpiresAt, now));

        long pendingReportCount = forumReportMapper.selectCount(new LambdaQueryWrapper<ForumReport>()
                .eq(ForumReport::getStatus, 1));
        long pendingAnnouncementCount = cmsAnnouncementMapper.selectCount(new LambdaQueryWrapper<CmsAnnouncement>()
                .eq(CmsAnnouncement::getPublishStatus, 1));

        List<String> todoItems = new ArrayList<>();
        if (pendingReportCount > 0) {
            todoItems.add("待处理举报：" + pendingReportCount + " 条");
        }
        if (pendingAnnouncementCount > 0) {
            todoItems.add("待发布公告草稿：" + pendingAnnouncementCount + " 条");
        }
        if (activeSessionCount > 20) {
            todoItems.add("当前活跃登录设备较多：" + activeSessionCount + " 台");
        }
        if (resourceCount == 0) {
            todoItems.add("资源中心仍缺少有效内容，建议补充示例资源与教程");
        }
        if (todoItems.isEmpty()) {
            todoItems.add("当前暂无高优先级待处理事项");
        }

        return Result.success(AdminDashboardOverviewVO.builder()
                .userCount(userCount)
                .todayUserCount(todayUserCount)
                .postCount(postCount)
                .todayPostCount(todayPostCount)
                .commentCount(commentCount)
                .todayCommentCount(todayCommentCount)
                .resourceCount(resourceCount)
                .todayResourceCount(todayResourceCount)
                .privateMessageCount(privateMessageCount)
                .todayLoginCount(todayLoginCount)
                .activeSessionCount(activeSessionCount)
                .pendingReportCount(pendingReportCount)
                .pendingAnnouncementCount(pendingAnnouncementCount)
                .todoItems(todoItems)
                .userTrend(buildTrend(sysUserMapper))
                .postTrend(buildTrend(forumPostMapper))
                .resourceTrend(buildTrend(resourceItemMapper))
                .topBoards(topBoards())
                .topTags(topTags())
                .hotResources(hotResources())
                .build());
    }

    private <T> List<AdminDashboardTrendPointVO> buildTrend(com.baomidou.mybatisplus.core.mapper.BaseMapper<T> mapper) {
        LocalDate start = LocalDate.now().minusDays(6);
        QueryWrapper<T> query = new QueryWrapper<>();
        query.select("DATE(created_at) AS stat_date", "COUNT(*) AS stat_value")
                .eq("deleted", 0)
                .ge("created_at", start.atStartOfDay())
                .groupBy("DATE(created_at)")
                .orderByAsc("stat_date");
        List<Map<String, Object>> rows = mapper.selectMaps(query);
        Map<String, Long> valueMap = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");
        for (int i = 0; i < 7; i++) {
            LocalDate date = start.plusDays(i);
            valueMap.put(date.format(formatter), 0L);
        }
        for (Map<String, Object> row : rows) {
            Object dateObj = row.get("stat_date");
            Object valueObj = row.get("stat_value");
            if (dateObj == null || valueObj == null) {
                continue;
            }
            String dateText = String.valueOf(dateObj);
            if (dateText.length() >= 10) {
                dateText = dateText.substring(0, 10);
            }
            LocalDate date = LocalDate.parse(dateText);
            valueMap.put(date.format(formatter), Long.parseLong(String.valueOf(valueObj)));
        }
        return valueMap.entrySet().stream().map(item -> AdminDashboardTrendPointVO.builder()
                .date(item.getKey())
                .value(item.getValue())
                .build()).toList();
    }

    private List<AdminDashboardRankItemVO> topBoards() {
        return forumBoardMapper.selectList(new LambdaQueryWrapper<ForumBoard>()
                        .eq(ForumBoard::getDeleted, 0)
                        .eq(ForumBoard::getStatus, 1)
                        .orderByDesc(ForumBoard::getPostCount)
                        .last("limit 6"))
                .stream()
                .map(item -> AdminDashboardRankItemVO.builder()
                        .name(item.getName())
                        .value(Long.valueOf(item.getPostCount() == null ? 0 : item.getPostCount()))
                        .extra(item.getSlug())
                        .build())
                .toList();
    }

    private List<AdminDashboardRankItemVO> topTags() {
        return forumTagMapper.selectList(new LambdaQueryWrapper<ForumTag>()
                        .eq(ForumTag::getDeleted, 0)
                        .eq(ForumTag::getStatus, 1)
                        .orderByDesc(ForumTag::getPostCount)
                        .last("limit 6"))
                .stream()
                .map(item -> AdminDashboardRankItemVO.builder()
                        .name(item.getName())
                        .value(Long.valueOf(item.getPostCount() == null ? 0 : item.getPostCount()))
                        .extra(item.getSlug())
                        .build())
                .toList();
    }

    private List<AdminDashboardRankItemVO> hotResources() {
        return resourceItemMapper.selectList(new LambdaQueryWrapper<ResourceItem>()
                        .eq(ResourceItem::getDeleted, 0)
                        .eq(ResourceItem::getStatus, 2)
                        .orderByDesc(ResourceItem::getDownloadCount)
                        .orderByDesc(ResourceItem::getLikeCount)
                        .last("limit 6"))
                .stream()
                .map(item -> AdminDashboardRankItemVO.builder()
                        .name(item.getTitle())
                        .value(Long.valueOf(item.getDownloadCount() == null ? 0 : item.getDownloadCount()))
                        .extra("点赞 " + (item.getLikeCount() == null ? 0 : item.getLikeCount()))
                        .build())
                .toList();
    }
}
