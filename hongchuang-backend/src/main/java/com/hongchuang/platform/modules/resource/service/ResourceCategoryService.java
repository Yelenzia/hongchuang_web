package com.hongchuang.platform.modules.resource.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.modules.resource.dto.ResourceCategorySaveRequest;
import com.hongchuang.platform.modules.resource.entity.ResourceCategory;
import com.hongchuang.platform.modules.resource.mapper.ResourceCategoryMapper;
import com.hongchuang.platform.modules.resource.mapper.ResourceItemMapper;
import com.hongchuang.platform.modules.resource.vo.ResourceCategoryVO;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceCategoryService {

    private final ResourceCategoryMapper resourceCategoryMapper;
    private final ResourceItemMapper resourceItemMapper;

    public List<ResourceCategoryVO> listEnabled() {
        return resourceCategoryMapper.selectList(new LambdaQueryWrapper<ResourceCategory>()
                        .eq(ResourceCategory::getStatus, 1)
                        .orderByAsc(ResourceCategory::getSortOrder)
                        .orderByAsc(ResourceCategory::getId))
                .stream()
                .map(this::toVO)
                .toList();
    }

    public List<ResourceCategoryVO> listAll() {
        return resourceCategoryMapper.selectList(new LambdaQueryWrapper<ResourceCategory>()
                        .orderByAsc(ResourceCategory::getSortOrder)
                        .orderByAsc(ResourceCategory::getId))
                .stream()
                .map(this::toVO)
                .toList();
    }

    public Long create(ResourceCategorySaveRequest request) {
        validateUnique(null, request.getName(), request.getSlug());
        ResourceCategory item = new ResourceCategory();
        item.setName(request.getName().trim());
        item.setSlug(request.getSlug().trim());
        item.setDescription(request.getDescription());
        item.setIcon(request.getIcon());
        item.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        item.setStatus(request.getStatus() == null ? 1 : request.getStatus());
        item.setResourceCount(0);
        item.setDeleted(0);
        resourceCategoryMapper.insert(item);
        return item.getId();
    }

    public void update(Long categoryId, ResourceCategorySaveRequest request) {
        ResourceCategory item = requireCategory(categoryId);
        validateUnique(categoryId, request.getName(), request.getSlug());
        item.setName(request.getName().trim());
        item.setSlug(request.getSlug().trim());
        item.setDescription(request.getDescription());
        item.setIcon(request.getIcon());
        item.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        item.setStatus(request.getStatus() == null ? item.getStatus() : request.getStatus());
        resourceCategoryMapper.updateById(item);
    }

    public void updateStatus(Long categoryId, Integer status) {
        ResourceCategory item = requireCategory(categoryId);
        item.setStatus(status);
        resourceCategoryMapper.updateById(item);
    }

    public void delete(Long categoryId) {
        ResourceCategory item = requireCategory(categoryId);
        Long count = resourceItemMapper.selectCount(new LambdaQueryWrapper<com.hongchuang.platform.modules.resource.entity.ResourceItem>()
                .eq(com.hongchuang.platform.modules.resource.entity.ResourceItem::getCategoryId, categoryId));
        if (count != null && count > 0) {
            throw new BusinessException("该分类下存在资源，不能直接删除");
        }
        resourceCategoryMapper.deleteById(item.getId());
    }

    public ResourceCategory requireCategory(Long categoryId) {
        ResourceCategory item = resourceCategoryMapper.selectById(categoryId);
        if (item == null || (item.getDeleted() != null && item.getDeleted() == 1)) {
            throw new BusinessException("资源分类不存在");
        }
        return item;
    }

    public ResourceCategoryVO toVO(ResourceCategory item) {
        return ResourceCategoryVO.builder()
                .id(item.getId())
                .name(item.getName())
                .slug(item.getSlug())
                .description(item.getDescription())
                .icon(item.getIcon())
                .sortOrder(item.getSortOrder())
                .status(item.getStatus())
                .resourceCount(item.getResourceCount())
                .build();
    }

    private void validateUnique(Long categoryId, String name, String slug) {
        if (StringUtils.isBlank(name) || StringUtils.isBlank(slug)) {
            throw new BusinessException("分类名称和标识不能为空");
        }
        long nameExists = resourceCategoryMapper.selectCount(new LambdaQueryWrapper<ResourceCategory>()
                .eq(ResourceCategory::getName, name.trim())
                .ne(categoryId != null, ResourceCategory::getId, categoryId));
        if (nameExists > 0) {
            throw new BusinessException("分类名称已存在");
        }
        long slugExists = resourceCategoryMapper.selectCount(new LambdaQueryWrapper<ResourceCategory>()
                .eq(ResourceCategory::getSlug, slug.trim())
                .ne(categoryId != null, ResourceCategory::getId, categoryId));
        if (slugExists > 0) {
            throw new BusinessException("分类标识已存在");
        }
    }
}
