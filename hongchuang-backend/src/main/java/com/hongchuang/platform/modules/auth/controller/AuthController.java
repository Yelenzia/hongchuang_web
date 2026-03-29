package com.hongchuang.platform.modules.auth.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.modules.auth.dto.ForgotPasswordRequest;
import com.hongchuang.platform.modules.auth.dto.LoginRequest;
import com.hongchuang.platform.modules.auth.dto.RegisterRequest;
import com.hongchuang.platform.modules.auth.dto.ResetPasswordRequest;
import com.hongchuang.platform.modules.auth.service.AuthService;
import com.hongchuang.platform.modules.auth.vo.LoginVO;
import com.hongchuang.platform.modules.user.service.UserService;
import com.hongchuang.platform.modules.user.vo.CurrentUserVO;
import com.hongchuang.platform.modules.verification.dto.SendEmailCodeRequest;
import com.hongchuang.platform.modules.verification.service.VerificationService;
import com.hongchuang.platform.modules.verification.vo.CaptchaVO;
import com.hongchuang.platform.modules.verification.vo.EmailCodeSendVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final VerificationService verificationService;

    public AuthController(AuthService authService, UserService userService, VerificationService verificationService) {
        this.authService = authService;
        this.userService = userService;
        this.verificationService = verificationService;
    }

    @GetMapping("/captcha")
    public Result<CaptchaVO> captcha() {
        return Result.success(verificationService.generateCaptcha());
    }

    @PostMapping("/email-code")
    public Result<EmailCodeSendVO> sendEmailCode(@Valid @RequestBody SendEmailCodeRequest request) {
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        String bizType = request.getBizType().trim().toUpperCase(Locale.ROOT);
        return switch (bizType) {
            case "REGISTER" -> Result.success(authService.sendRegisterCode(request.getEmail()));
            case "LOGIN" -> Result.success(authService.sendLoginCode(request.getAccount()));
            case "RESET_PASSWORD" -> Result.success(authService.sendResetPasswordCode(request.getEmail()));
            default -> throw new BusinessException("不支持的验证码业务类型");
        };
    }

    @PostMapping("/register")
    public Result<?> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpServletRequest) {
        return Result.success("注册成功", java.util.Map.of("userId", authService.register(request, httpServletRequest)));
    }

    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpServletRequest) {
        return Result.success("登录成功", authService.login(request, httpServletRequest));
    }

    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        String token = null;
        if (authorization != null && authorization.startsWith("Bearer ")) {
            token = authorization.substring(7);
        }
        authService.logout(token);
        return Result.success("退出成功", null);
    }

    @PostMapping("/forgot-password")
    public Result<EmailCodeSendVO> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return Result.success(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public Result<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return Result.success("密码重置成功", null);
    }

    @GetMapping("/me")
    public Result<CurrentUserVO> me() {
        return Result.success(userService.getCurrentUser());
    }
}
