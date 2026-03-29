package com.hongchuang.platform.modules.achievement.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.modules.achievement.service.AchievementService;
import com.hongchuang.platform.modules.achievement.vo.AchievementVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping("/me")
    public Result<List<AchievementVO>> myAchievements() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        return Result.success(achievementService.listAllWithUserState(userId));
    }

    @GetMapping("/users/{userId}")
    public Result<List<AchievementVO>> userAchievements(@PathVariable Long userId) {
        return Result.success(achievementService.listUserAchievements(userId));
    }
}
