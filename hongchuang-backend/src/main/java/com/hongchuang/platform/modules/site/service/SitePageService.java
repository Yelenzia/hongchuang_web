package com.hongchuang.platform.modules.site.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.site.dto.SitePageSaveRequest;
import com.hongchuang.platform.modules.site.entity.CmsSitePage;
import com.hongchuang.platform.modules.site.mapper.CmsSitePageMapper;
import com.hongchuang.platform.modules.site.vo.SitePageVO;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SitePageService {

    private final CmsSitePageMapper cmsSitePageMapper;
    private final ObjectMapper objectMapper;

    public Page<CmsSitePage> pageAdmin(long pageNo, long pageSize, String keyword, Integer status) {
        LambdaQueryWrapper<CmsSitePage> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(keyword)) {
            String value = keyword.trim();
            wrapper.and(w -> w.like(CmsSitePage::getPageCode, value)
                    .or().like(CmsSitePage::getPageName, value)
                    .or().like(CmsSitePage::getTitle, value));
        }
        if (status != null) {
            wrapper.eq(CmsSitePage::getStatus, status);
        }
        wrapper.orderByAsc(CmsSitePage::getSortOrder).orderByAsc(CmsSitePage::getId);
        return cmsSitePageMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
    }

    public SitePageVO detailAdmin(Long id) {
        return toVO(requireById(id));
    }

    public SitePageVO detailByCode(String pageCode) {
        CmsSitePage page = cmsSitePageMapper.selectOne(new LambdaQueryWrapper<CmsSitePage>()
                .eq(CmsSitePage::getPageCode, normalizeCode(pageCode))
                .eq(CmsSitePage::getStatus, 1)
                .last("limit 1"));
        if (page == null) {
            throw new BusinessException("页面配置不存在");
        }
        return toVO(page);
    }

    @Transactional(rollbackFor = Exception.class)
    public Long create(SitePageSaveRequest request) {
        validateContentJson(request.getContentJson());
        String pageCode = normalizeCode(request.getPageCode());
        long exists = cmsSitePageMapper.selectCount(new LambdaQueryWrapper<CmsSitePage>()
                .eq(CmsSitePage::getPageCode, pageCode));
        if (exists > 0) {
            throw new BusinessException("页面编码已存在");
        }
        CmsSitePage page = new CmsSitePage();
        apply(page, request, pageCode);
        cmsSitePageMapper.insert(page);
        return page.getId();
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, SitePageSaveRequest request) {
        validateContentJson(request.getContentJson());
        CmsSitePage page = requireById(id);
        String pageCode = normalizeCode(request.getPageCode());
        long exists = cmsSitePageMapper.selectCount(new LambdaQueryWrapper<CmsSitePage>()
                .eq(CmsSitePage::getPageCode, pageCode)
                .ne(CmsSitePage::getId, id));
        if (exists > 0) {
            throw new BusinessException("页面编码已存在");
        }
        apply(page, request, pageCode);
        cmsSitePageMapper.updateById(page);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, Integer status) {
        CmsSitePage page = requireById(id);
        page.setStatus(status == null || status != 1 ? 0 : 1);
        cmsSitePageMapper.updateById(page);
    }

    private void apply(CmsSitePage page, SitePageSaveRequest request, String pageCode) {
        page.setPageCode(pageCode);
        page.setPageName(SanitizeUtils.cleanText(request.getPageName()));
        page.setTitle(SanitizeUtils.cleanText(request.getTitle()));
        page.setSubtitle(SanitizeUtils.cleanText(request.getSubtitle()));
        page.setContentJson(request.getContentJson().trim());
        page.setStatus(request.getStatus() == null || request.getStatus() != 0 ? 1 : 0);
        page.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
    }

    private CmsSitePage requireById(Long id) {
        CmsSitePage page = cmsSitePageMapper.selectById(id);
        if (page == null) {
            throw new BusinessException("页面配置不存在");
        }
        return page;
    }

    private String normalizeCode(String pageCode) {
        if (StringUtils.isBlank(pageCode)) {
            throw new BusinessException("页面编码不能为空");
        }
        return pageCode.trim().toUpperCase();
    }

    private void validateContentJson(String contentJson) {
        try {
            objectMapper.readTree(contentJson);
        } catch (Exception e) {
            throw new BusinessException("页面内容 JSON 不合法");
        }
    }

    private SitePageVO toVO(CmsSitePage item) {
        return SitePageVO.builder()
                .id(item.getId())
                .pageCode(item.getPageCode())
                .pageName(item.getPageName())
                .title(item.getTitle())
                .subtitle(item.getSubtitle())
                .contentJson(item.getContentJson())
                .status(item.getStatus())
                .sortOrder(item.getSortOrder())
                .updatedAt(item.getUpdatedAt() == null ? null : item.getUpdatedAt().toString())
                .build();
    }
}
