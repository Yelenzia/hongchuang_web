package com.hongchuang.platform.modules.report.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.report.dto.CreateReportRequest;
import com.hongchuang.platform.modules.report.dto.HandleReportRequest;
import com.hongchuang.platform.modules.report.entity.ForumReport;
import com.hongchuang.platform.modules.report.mapper.ForumReportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ForumReportMapper forumReportMapper;

    public Long create(CreateReportRequest request) {
        ForumReport report = new ForumReport();
        report.setReporterId(CurrentUserUtils.getCurrentUserId());
        report.setTargetType(request.getTargetType());
        report.setTargetId(request.getTargetId());
        report.setReasonType(request.getReasonType());
        report.setReasonDetail(SanitizeUtils.cleanText(request.getReasonDetail()));
        report.setStatus(1);
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        forumReportMapper.insert(report);
        return report.getId();
    }

    public Page<ForumReport> pageAdmin(long pageNo, long pageSize) {
        return forumReportMapper.selectPage(Page.of(pageNo, pageSize), new LambdaQueryWrapper<ForumReport>()
                .orderByDesc(ForumReport::getCreatedAt));
    }

    public void handle(Long reportId, HandleReportRequest request) {
        ForumReport report = forumReportMapper.selectById(reportId);
        if (report == null) {
            throw new BusinessException("举报不存在");
        }
        report.setStatus(request.getStatus());
        report.setHandleNote(SanitizeUtils.cleanText(request.getHandleNote()));
        report.setHandlerId(CurrentUserUtils.getCurrentUserId());
        report.setHandledAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        forumReportMapper.updateById(report);
    }
}
