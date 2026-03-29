package com.hongchuang.platform.modules.auth.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.auth.dto.ForgotPasswordRequest;
import com.hongchuang.platform.modules.auth.dto.LoginRequest;
import com.hongchuang.platform.modules.auth.dto.RegisterRequest;
import com.hongchuang.platform.modules.auth.dto.ResetPasswordRequest;
import com.hongchuang.platform.modules.auth.vo.LoginVO;
import com.hongchuang.platform.modules.achievement.service.AchievementService;
import com.hongchuang.platform.modules.system.service.ForumUidService;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import com.hongchuang.platform.modules.session.service.UserLoginSessionService;
import com.hongchuang.platform.modules.verification.service.VerificationService;
import com.hongchuang.platform.modules.verification.vo.EmailCodeSendVO;
import com.hongchuang.platform.security.jwt.JwtProperties;
import com.hongchuang.platform.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final StringRedisTemplate stringRedisTemplate;
    private final ForumUidService forumUidService;
    private final AchievementService achievementService;
    private final VerificationService verificationService;
    private final UserLoginSessionService userLoginSessionService;

    @Transactional(rollbackFor = Exception.class)
    public Long register(RegisterRequest request, HttpServletRequest httpServletRequest) {
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        verificationService.validateEmailCode("REGISTER", request.getEmail(), request.getEmailCode());
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次输入的密码不一致");
        }
        if (existsUsername(request.getUsername())) {
            throw new BusinessException("用户名已存在");
        }
        if (existsEmail(request.getEmail())) {
            throw new BusinessException("邮箱已存在");
        }

        SysUser user = new SysUser();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setStatus(1);
        user.setEmailVerified(1);
        user.setRegisterIp(getClientIp(httpServletRequest));
        user.setForumUid(forumUidService.nextForumUid());
        sysUserMapper.insert(user);

        SysUserProfile profile = new SysUserProfile();
        profile.setUserId(user.getId());
        profile.setNickname(SanitizeUtils.cleanText(request.getUsername()));
        profile.setSignature("这个人很懒，还没有写签名。");
        profile.setBusinessCard(null);
        profile.setUserLevel(1);
        profile.setExperiencePoints(8);
        profile.setPostCount(0);
        profile.setCommentCount(0);
        profile.setFavoriteCount(0);
        profile.setFollowingCount(0);
        profile.setFollowerCount(0);
        profile.setLikeReceivedCount(0);
        sysUserProfileMapper.insert(profile);
        achievementService.awardForRegister(user.getId());
        return user.getId();
    }

    public LoginVO login(LoginRequest request, HttpServletRequest httpServletRequest) {
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        String lockKey = "auth:fail:" + request.getAccount();
        Integer failCount = safeGetInt(lockKey);
        if (failCount != null && failCount >= 8) {
            throw new BusinessException(429, "登录失败次数过多，请稍后再试");
        }

        SysUser user = findByAccount(request.getAccount());
        if (user != null && user.getStatus() != null && user.getStatus() == 2) {
            throw new BusinessException(403, "账号已被封禁");
        }
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        verificationService.validateEmailCode("LOGIN", user.getEmail(), request.getEmailCode());

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getAccount(), request.getPassword()));
        } catch (Exception ex) {
            safeIncrementWithExpire(lockKey, Duration.ofMinutes(15));
            throw ex;
        }

        user = findByAccount(request.getAccount());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        sysUserMapper.updateById(updateLoginInfo(user, getClientIp(httpServletRequest)));
        safeDelete(lockKey);

        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, user.getId())
                .last("limit 1"));

        String sessionId = userLoginSessionService.createSessionId();
        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getUsername(), user.getRole(), sessionId);
        userLoginSessionService.recordLogin(user.getId(), sessionId, accessToken, jwtProperties.getAccessTokenExpireSeconds(), httpServletRequest);
        return LoginVO.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getAccessTokenExpireSeconds())
                .userInfo(LoginVO.UserInfo.builder()
                        .id(user.getId())
                        .forumUid(user.getForumUid())
                        .username(user.getUsername())
                        .nickname(profile == null ? user.getUsername() : profile.getNickname())
                        .avatarUrl(profile == null ? null : profile.getAvatarUrl())
                        .signature(profile == null ? null : profile.getSignature())
                        .businessCard(profile == null ? null : profile.getBusinessCard())
                        .userLevel(profile == null || profile.getUserLevel() == null ? 1 : profile.getUserLevel())
                        .experiencePoints(profile == null || profile.getExperiencePoints() == null ? 0 : profile.getExperiencePoints())
                        .role(user.getRole())
                        .build())
                .build();
    }

    public void logout(String token) {
        userLoginSessionService.revokeByToken(token);
        if (token != null && jwtTokenProvider.validate(token)) {
            long remainSeconds = jwtTokenProvider.getRemainSeconds(token);
            if (remainSeconds > 0) {
                try {
                    stringRedisTemplate.opsForValue().set("auth:blacklist:" + token, "1", Duration.ofSeconds(remainSeconds));
                } catch (Exception ex) {
                    log.warn("Redis unavailable when blacklisting token. logout will continue without blacklist. message={}", ex.getMessage());
                }
            }
        }
    }

    public EmailCodeSendVO sendRegisterCode(String email) {
        if (existsEmail(email)) {
            throw new BusinessException("邮箱已存在");
        }
        return verificationService.sendEmailCode("REGISTER", email);
    }

    public EmailCodeSendVO sendLoginCode(String account) {
        SysUser user = findByAccount(account);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return verificationService.sendEmailCode("LOGIN", user.getEmail());
    }

    public EmailCodeSendVO sendResetPasswordCode(String email) {
        SysUser user = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getEmail, email)
                .last("limit 1"));
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return verificationService.sendEmailCode("RESET_PASSWORD", email);
    }

    public EmailCodeSendVO forgotPassword(ForgotPasswordRequest request) {
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        return sendResetPasswordCode(request.getEmail());
    }

    public void resetPassword(ResetPasswordRequest request) {
        verificationService.validateCaptcha(request.getCaptchaId(), request.getCaptchaCode());
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("两次输入的新密码不一致");
        }
        verificationService.validateEmailCode("RESET_PASSWORD", request.getEmail(), request.getCode());

        SysUser user = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getEmail, request.getEmail())
                .last("limit 1"));
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        sysUserMapper.updateById(user);
    }

    private boolean existsUsername(String username) {
        return sysUserMapper.selectCount(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, username)) > 0;
    }

    private boolean existsEmail(String email) {
        return sysUserMapper.selectCount(new LambdaQueryWrapper<SysUser>().eq(SysUser::getEmail, email)) > 0;
    }

    private SysUser findByAccount(String account) {
        return sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, account)
                .or()
                .eq(SysUser::getEmail, account)
                .last("limit 1"));
    }

    private SysUser updateLoginInfo(SysUser user, String ip) {
        SysUser update = new SysUser();
        update.setId(user.getId());
        update.setLastLoginAt(java.time.LocalDateTime.now());
        update.setLastLoginIp(ip);
        return update;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private Integer safeGetInt(String key) {
        try {
            String value = stringRedisTemplate.opsForValue().get(key);
            return value == null ? null : Integer.parseInt(value);
        } catch (Exception ex) {
            log.warn("Redis unavailable when reading key [{}], login will continue without rate-limit cache. message={}", key, ex.getMessage());
            return null;
        }
    }

    private void safeIncrementWithExpire(String key, Duration duration) {
        try {
            Long count = stringRedisTemplate.opsForValue().increment(key);
            if (count != null && count == 1) {
                stringRedisTemplate.expire(key, duration);
            }
        } catch (Exception ex) {
            log.warn("Redis unavailable when incrementing key [{}]. message={}", key, ex.getMessage());
        }
    }

    private void safeDelete(String key) {
        try {
            stringRedisTemplate.delete(key);
        } catch (Exception ex) {
            log.warn("Redis unavailable when deleting key [{}]. message={}", key, ex.getMessage());
        }
    }
}
