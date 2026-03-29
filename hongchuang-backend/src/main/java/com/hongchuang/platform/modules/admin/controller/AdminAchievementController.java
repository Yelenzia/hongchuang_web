package com.hongchuang.platform.modules.admin.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.achievement.dto.AchievementSaveRequest;
import com.hongchuang.platform.modules.achievement.entity.ForumAchievement;
import com.hongchuang.platform.modules.achievement.service.AchievementService;
import com.hongchuang.platform.modules.achievement.vo.AchievementVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/achievements")
public class AdminAchievementController {

    private final AchievementService achievementService;

    public AdminAchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public Result<List<ForumAchievement>> list() {
        return Result.success(achievementService.adminList());
    }

    @PostMapping
    public Result<Void> create(@Valid @RequestBody AchievementSaveRequest request) {
        achievementService.save(null, request);
        return Result.success("成就创建成功", null);
    }

    @PutMapping("/{achievementId}")
    public Result<Void> update(@PathVariable Long achievementId, @Valid @RequestBody AchievementSaveRequest request) {
        achievementService.save(achievementId, request);
        return Result.success("成就更新成功", null);
    }

    @GetMapping("/users/{userId}")
    public Result<List<AchievementVO>> userAchievements(@PathVariable Long userId) {
        return Result.success(achievementService.listAllWithUserState(userId));
    }

    @PostMapping("/users/{userId}/{code}")
    public Result<Void> grant(@PathVariable Long userId, @PathVariable String code) {
        achievementService.awardByCode(userId, code);
        return Result.success("成就已发放", null);
    }
}
