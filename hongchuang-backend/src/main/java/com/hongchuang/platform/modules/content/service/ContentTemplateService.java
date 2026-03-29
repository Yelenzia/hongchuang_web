package com.hongchuang.platform.modules.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.content.dto.TemplateSaveRequest;
import com.hongchuang.platform.modules.content.entity.ContentTemplate;
import com.hongchuang.platform.modules.content.mapper.ContentTemplateMapper;
import com.hongchuang.platform.modules.content.vo.ContentTemplateVO;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContentTemplateService {

    private final ContentTemplateMapper contentTemplateMapper;
    private final ObjectMapper objectMapper;

    public List<ContentTemplateVO> listEnabled(String templateType, String sceneCode) {
        LambdaQueryWrapper<ContentTemplate> wrapper = new LambdaQueryWrapper<ContentTemplate>()
                .eq(ContentTemplate::getEnabled, 1)
                .eq(ContentTemplate::getDeleted, 0)
                .orderByAsc(ContentTemplate::getSortOrder)
                .orderByAsc(ContentTemplate::getId);
        if (StringUtils.isNotBlank(templateType)) {
            wrapper.eq(ContentTemplate::getTemplateType, templateType.trim());
        }
        if (StringUtils.isNotBlank(sceneCode)) {
            wrapper.eq(ContentTemplate::getSceneCode, sceneCode.trim());
        }
        return contentTemplateMapper.selectList(wrapper).stream().map(this::toVO).toList();
    }

    public Page<ContentTemplate> pageAdmin(long pageNo, long pageSize, String templateType, String keyword, Integer enabled) {
        LambdaQueryWrapper<ContentTemplate> wrapper = new LambdaQueryWrapper<ContentTemplate>()
                .eq(ContentTemplate::getDeleted, 0);
        if (StringUtils.isNotBlank(templateType)) {
            wrapper.eq(ContentTemplate::getTemplateType, templateType.trim());
        }
        if (enabled != null) {
            wrapper.eq(ContentTemplate::getEnabled, enabled);
        }
        if (StringUtils.isNotBlank(keyword)) {
            wrapper.and(w -> w.like(ContentTemplate::getTemplateName, keyword)
                    .or().like(ContentTemplate::getSceneCode, keyword)
                    .or().like(ContentTemplate::getTitleExample, keyword));
        }
        wrapper.orderByAsc(ContentTemplate::getSortOrder).orderByDesc(ContentTemplate::getUpdatedAt);
        return contentTemplateMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
    }

    @Transactional(rollbackFor = Exception.class)
    public Long create(TemplateSaveRequest request) {
        ContentTemplate template = new ContentTemplate();
        fillTemplate(template, request);
        contentTemplateMapper.insert(template);
        return template.getId();
    }

    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, TemplateSaveRequest request) {
        ContentTemplate template = requireTemplate(id);
        fillTemplate(template, request);
        contentTemplateMapper.updateById(template);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateEnabled(Long id, Integer enabled) {
        ContentTemplate template = requireTemplate(id);
        template.setEnabled(enabled != null && enabled == 1 ? 1 : 0);
        contentTemplateMapper.updateById(template);
    }

    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        ContentTemplate template = requireTemplate(id);
        template.setDeleted(1);
        contentTemplateMapper.updateById(template);
    }

    public ContentTemplate requireTemplate(Long id) {
        ContentTemplate template = contentTemplateMapper.selectById(id);
        if (template == null || (template.getDeleted() != null && template.getDeleted() == 1)) {
            throw new BusinessException("模板不存在");
        }
        return template;
    }

    public ContentTemplateVO detail(Long id) {
        return toVO(requireTemplate(id));
    }

    private void fillTemplate(ContentTemplate template, TemplateSaveRequest request) {
        template.setTemplateName(SanitizeUtils.cleanText(request.getTemplateName()));
        template.setTemplateType(StringUtils.upperCase(StringUtils.trimToEmpty(request.getTemplateType())));
        template.setSceneCode(StringUtils.upperCase(StringUtils.trimToEmpty(request.getSceneCode())));
        template.setTitleExample(SanitizeUtils.cleanText(request.getTitleExample()));
        template.setSummaryExample(SanitizeUtils.cleanText(request.getSummaryExample()));
        template.setContentMarkdown(request.getContentMarkdown());
        template.setExtraJson(toJson(request.getExtraData()));
        template.setEnabled(request.getEnabled() != null && request.getEnabled() == 0 ? 0 : 1);
        template.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        if (template.getDeleted() == null) {
            template.setDeleted(0);
        }
    }

    private ContentTemplateVO toVO(ContentTemplate template) {
        return ContentTemplateVO.builder()
                .id(template.getId())
                .templateName(template.getTemplateName())
                .templateType(template.getTemplateType())
                .sceneCode(template.getSceneCode())
                .titleExample(template.getTitleExample())
                .summaryExample(template.getSummaryExample())
                .contentMarkdown(template.getContentMarkdown())
                .extraData(parseJson(template.getExtraJson()))
                .enabled(template.getEnabled())
                .sortOrder(template.getSortOrder())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }

    private String toJson(Map<String, Object> extraData) {
        if (extraData == null || extraData.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(extraData);
        } catch (Exception e) {
            throw new BusinessException("模板扩展数据格式错误");
        }
    }

    private Map<String, Object> parseJson(String value) {
        if (StringUtils.isBlank(value)) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(value, new TypeReference<>() {});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }
}
