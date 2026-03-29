package com.hongchuang.platform.modules.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.modules.content.entity.UploadFileLog;
import com.hongchuang.platform.modules.content.mapper.UploadFileLogMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UploadFileLogService {

    private final UploadFileLogMapper uploadFileLogMapper;

    public void record(Long userId, String bizType, String fileName, String fileUrl, String fileExt, String contentType, Long fileSize) {
        UploadFileLog log = new UploadFileLog();
        log.setUserId(userId);
        log.setBizType(bizType);
        log.setFileName(fileName);
        log.setFileUrl(fileUrl);
        log.setFileExt(fileExt);
        log.setContentType(contentType);
        log.setFileSize(fileSize);
        log.setDeleted(0);
        uploadFileLogMapper.insert(log);
    }

    public Page<UploadFileLog> pageAdmin(long pageNo, long pageSize, String bizType, Long userId) {
        LambdaQueryWrapper<UploadFileLog> wrapper = new LambdaQueryWrapper<UploadFileLog>()
                .eq(UploadFileLog::getDeleted, 0)
                .orderByDesc(UploadFileLog::getCreatedAt);
        if (StringUtils.isNotBlank(bizType)) {
            wrapper.eq(UploadFileLog::getBizType, bizType.trim());
        }
        if (userId != null) {
            wrapper.eq(UploadFileLog::getUserId, userId);
        }
        return uploadFileLogMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
    }
}
