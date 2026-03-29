package com.hongchuang.platform.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.content.entity.ContentDraft;
import com.hongchuang.platform.modules.content.service.ContentDraftService;
import com.hongchuang.platform.modules.content.service.UploadFileLogService;
import com.hongchuang.platform.modules.content.entity.UploadFileLog;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/drafts")
@RequiredArgsConstructor
public class AdminDraftController {

    private final ContentDraftService contentDraftService;
    private final UploadFileLogService uploadFileLogService;
    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;

    @GetMapping
    public Result<Page<Map<String, Object>>> page(@RequestParam(defaultValue = "1") long pageNo,
                                                  @RequestParam(defaultValue = "10") long pageSize,
                                                  @RequestParam(required = false) String draftType,
                                                  @RequestParam(required = false) Long ownerUserId,
                                                  @RequestParam(required = false) String keyword) {
        Page<ContentDraft> page = contentDraftService.pageAdmin(pageNo, pageSize, draftType, ownerUserId, keyword);
        Page<Map<String, Object>> result = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        result.setRecords(page.getRecords().stream().map(this::toDraftRow).toList());
        return Result.success(result);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        contentDraftService.adminDelete(id);
        return Result.success("草稿已删除", null);
    }

    @GetMapping("/upload-logs")
    public Result<Page<Map<String, Object>>> uploadLogs(@RequestParam(defaultValue = "1") long pageNo,
                                                        @RequestParam(defaultValue = "10") long pageSize,
                                                        @RequestParam(required = false) String bizType,
                                                        @RequestParam(required = false) Long userId) {
        Page<UploadFileLog> page = uploadFileLogService.pageAdmin(pageNo, pageSize, bizType, userId);
        Page<Map<String, Object>> result = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        result.setRecords(page.getRecords().stream().map(this::toUploadRow).toList());
        return Result.success(result);
    }

    private Map<String, Object> toDraftRow(ContentDraft item) {
        SysUser user = sysUserMapper.selectById(item.getOwnerUserId());
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, item.getOwnerUserId())
                .last("limit 1"));
        Map<String, Object> row = new HashMap<>();
        row.put("id", item.getId());
        row.put("draftType", item.getDraftType());
        row.put("sceneCode", item.getSceneCode());
        row.put("ownerUserId", item.getOwnerUserId());
        row.put("username", user == null ? null : user.getUsername());
        row.put("nickname", profile == null ? null : profile.getNickname());
        row.put("title", item.getTitle());
        row.put("summary", item.getSummary());
        row.put("autoSaved", item.getAutoSaved());
        row.put("updatedAt", item.getUpdatedAt());
        row.put("createdAt", item.getCreatedAt());
        return row;
    }

    private Map<String, Object> toUploadRow(UploadFileLog item) {
        SysUser user = item.getUserId() == null ? null : sysUserMapper.selectById(item.getUserId());
        SysUserProfile profile = item.getUserId() == null ? null : sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, item.getUserId())
                .last("limit 1"));
        Map<String, Object> row = new HashMap<>();
        row.put("id", item.getId());
        row.put("userId", item.getUserId());
        row.put("username", user == null ? null : user.getUsername());
        row.put("nickname", profile == null ? null : profile.getNickname());
        row.put("bizType", item.getBizType());
        row.put("fileName", item.getFileName());
        row.put("fileUrl", item.getFileUrl());
        row.put("fileExt", item.getFileExt());
        row.put("contentType", item.getContentType());
        row.put("fileSize", item.getFileSize());
        row.put("createdAt", item.getCreatedAt());
        return row;
    }
}
