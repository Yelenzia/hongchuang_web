package com.hongchuang.platform.modules.user.controller;

import com.hongchuang.platform.common.api.PageResult;
import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.modules.session.service.UserLoginSessionService;
import com.hongchuang.platform.modules.session.vo.UserLoginSessionVO;
import com.hongchuang.platform.modules.social.service.SocialService;
import com.hongchuang.platform.modules.social.vo.UserRelationVO;
import com.hongchuang.platform.modules.user.dto.CancelAccountRequest;
import com.hongchuang.platform.modules.user.dto.ChangePasswordRequest;
import com.hongchuang.platform.modules.user.dto.UpdateProfileRequest;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.service.UserService;
import com.hongchuang.platform.modules.user.vo.PublicUserProfileVO;
import com.hongchuang.platform.modules.user.vo.UserSearchVO;
import com.hongchuang.platform.modules.verification.dto.SendEmailCodeRequest;
import com.hongchuang.platform.modules.verification.service.VerificationService;
import com.hongchuang.platform.modules.verification.vo.EmailCodeSendVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final VerificationService verificationService;
    private final SysUserMapper sysUserMapper;
    private final SocialService socialService;
    private final UserLoginSessionService userLoginSessionService;

    public UserController(UserService userService, VerificationService verificationService, SysUserMapper sysUserMapper, SocialService socialService, UserLoginSessionService userLoginSessionService) {
        this.userService = userService;
        this.verificationService = verificationService;
        this.sysUserMapper = sysUserMapper;
        this.socialService = socialService;
        this.userLoginSessionService = userLoginSessionService;
    }

    @GetMapping("/search")
    public Result<List<UserSearchVO>> searchUsers(@RequestParam String keyword,
                                                  @RequestParam(defaultValue = "10") Integer limit) {
        return Result.success(userService.searchUsers(keyword, limit));
    }

    @PutMapping("/me/profile")
    public Result<Void> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        userService.updateProfile(request);
        return Result.success("资料更新成功", null);
    }

    @PostMapping("/me/password/email-code")
    public Result<EmailCodeSendVO> sendChangePasswordEmailCode(@Valid @RequestBody SendEmailCodeRequest request) {
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        Long userId = CurrentUserUtils.getCurrentUserId();
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return Result.success(verificationService.sendEmailCode("CHANGE_PASSWORD", user.getEmail()));
    }

    @PutMapping("/me/password")
    public Result<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return Result.success("密码修改成功", null);
    }

    @PostMapping("/me/cancel/email-code")
    public Result<EmailCodeSendVO> sendCancelAccountEmailCode(@Valid @RequestBody SendEmailCodeRequest request) {
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        Long userId = CurrentUserUtils.getCurrentUserId();
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null || (user.getDeleted() != null && user.getDeleted() == 1)) {
            throw new BusinessException("用户不存在");
        }
        return Result.success(verificationService.sendEmailCode("CANCEL_ACCOUNT", user.getEmail()));
    }

    @PostMapping("/me/cancel")
    public Result<Void> cancelAccount(@Valid @RequestBody CancelAccountRequest request,
                                      @RequestHeader(value = "Authorization", required = false) String authorization) {
        userService.cancelAccount(request, authorization);
        return Result.success("账号已注销", null);
    }


    @GetMapping("/me/devices")
    public Result<List<UserLoginSessionVO>> myDevices(@RequestHeader(value = "Authorization", required = false) String authorization) {
        String token = authorization != null && authorization.startsWith("Bearer ") ? authorization.substring(7) : null;
        return Result.success(userLoginSessionService.listMySessions(token));
    }

    @DeleteMapping("/me/devices/{sessionId}")
    public Result<Void> revokeDevice(@PathVariable String sessionId) {
        userLoginSessionService.revokeSession(sessionId);
        return Result.success("设备已下线", null);
    }

    @DeleteMapping("/me/devices/others")
    public Result<Void> revokeOtherDevices(@RequestHeader(value = "Authorization", required = false) String authorization) {
        String token = authorization != null && authorization.startsWith("Bearer ") ? authorization.substring(7) : null;
        userLoginSessionService.revokeOtherSessions(token);
        return Result.success("其他设备已全部下线", null);
    }

    @GetMapping("/{userId}/profile")
    public Result<PublicUserProfileVO> getUserProfile(@PathVariable Long userId) {
        return Result.success(userService.getPublicProfile(userId));
    }

    @PostMapping("/{userId}/follow")
    public Result<Void> follow(@PathVariable Long userId) {
        socialService.followUser(userId);
        return Result.success("关注成功", null);
    }

    @DeleteMapping("/{userId}/follow")
    public Result<Void> unfollow(@PathVariable Long userId) {
        socialService.unfollowUser(userId);
        return Result.success("取消关注成功", null);
    }

    @GetMapping("/me/follows")
    public Result<List<UserRelationVO>> myFollowingList() {
        return Result.success(socialService.myFollowingList());
    }

    @GetMapping("/me/fans")
    public Result<List<UserRelationVO>> myFollowerList() {
        return Result.success(socialService.myFollowerList());
    }
}
