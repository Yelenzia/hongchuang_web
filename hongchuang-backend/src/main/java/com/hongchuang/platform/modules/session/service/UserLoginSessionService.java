package com.hongchuang.platform.modules.session.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.modules.session.entity.UserLoginSession;
import com.hongchuang.platform.modules.session.mapper.UserLoginSessionMapper;
import com.hongchuang.platform.modules.session.vo.UserLoginSessionVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserLoginSessionService {

    private static final int STATUS_ACTIVE = 1;
    private static final int STATUS_REVOKED = 0;

    private final UserLoginSessionMapper userLoginSessionMapper;

    public String createSessionId() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    @Transactional(rollbackFor = Exception.class)
    public void recordLogin(Long userId,
                            String sessionId,
                            String token,
                            long expireSeconds,
                            HttpServletRequest request) {
        DeviceSnapshot snapshot = parseRequest(request);
        LocalDateTime now = LocalDateTime.now();
        UserLoginSession session = new UserLoginSession();
        session.setSessionId(sessionId);
        session.setUserId(userId);
        session.setTokenHash(hashToken(token));
        session.setDeviceType(snapshot.deviceType());
        session.setDeviceName(snapshot.deviceName());
        session.setBrowser(snapshot.browser());
        session.setOs(snapshot.os());
        session.setLoginIp(snapshot.ip());
        session.setLastActiveAt(now);
        session.setExpiresAt(now.plusSeconds(Math.max(expireSeconds, 60)));
        session.setStatus(STATUS_ACTIVE);
        session.setDeleted(0);
        userLoginSessionMapper.insert(session);
    }

    public boolean isTokenActive(String token) {
        if (StringUtils.isBlank(token)) {
            return false;
        }
        UserLoginSession session = userLoginSessionMapper.selectOne(new LambdaQueryWrapper<UserLoginSession>()
                .eq(UserLoginSession::getTokenHash, hashToken(token))
                .eq(UserLoginSession::getDeleted, 0)
                .last("limit 1"));
        if (session == null) {
            return false;
        }
        if (session.getStatus() == null || session.getStatus() != STATUS_ACTIVE) {
            return false;
        }
        if (session.getExpiresAt() != null && session.getExpiresAt().isBefore(LocalDateTime.now())) {
            revokeEntity(session);
            return false;
        }
        return true;
    }

    @Transactional(rollbackFor = Exception.class)
    public void touchSession(String token, HttpServletRequest request) {
        if (StringUtils.isBlank(token)) {
            return;
        }
        UserLoginSession session = userLoginSessionMapper.selectOne(new LambdaQueryWrapper<UserLoginSession>()
                .eq(UserLoginSession::getTokenHash, hashToken(token))
                .eq(UserLoginSession::getDeleted, 0)
                .last("limit 1"));
        if (session == null || session.getStatus() == null || session.getStatus() != STATUS_ACTIVE) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        if (session.getLastActiveAt() != null && session.getLastActiveAt().plusMinutes(2).isAfter(now)) {
            return;
        }
        String ip = extractIp(request);
        userLoginSessionMapper.update(null, new LambdaUpdateWrapper<UserLoginSession>()
                .eq(UserLoginSession::getId, session.getId())
                .set(UserLoginSession::getLastActiveAt, now)
                .set(StringUtils.isNotBlank(ip), UserLoginSession::getLoginIp, ip));
    }

    @Transactional(rollbackFor = Exception.class)
    public void revokeByToken(String token) {
        if (StringUtils.isBlank(token)) {
            return;
        }
        UserLoginSession session = userLoginSessionMapper.selectOne(new LambdaQueryWrapper<UserLoginSession>()
                .eq(UserLoginSession::getTokenHash, hashToken(token))
                .eq(UserLoginSession::getDeleted, 0)
                .last("limit 1"));
        if (session != null) {
            revokeEntity(session);
        }
    }

    public List<UserLoginSessionVO> listMySessions(String currentToken) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        String currentSessionHash = StringUtils.isBlank(currentToken) ? "" : hashToken(currentToken);
        List<UserLoginSession> rows = userLoginSessionMapper.selectList(new LambdaQueryWrapper<UserLoginSession>()
                .eq(UserLoginSession::getUserId, userId)
                .eq(UserLoginSession::getDeleted, 0)
                .orderByDesc(UserLoginSession::getLastActiveAt)
                .last("limit 20"));
        LocalDateTime now = LocalDateTime.now();
        return rows.stream().map(item -> {
            boolean expired = item.getExpiresAt() != null && item.getExpiresAt().isBefore(now);
            return UserLoginSessionVO.builder()
                    .sessionId(item.getSessionId())
                    .deviceType(defaultText(item.getDeviceType(), "desktop"))
                    .deviceName(defaultText(item.getDeviceName(), "未知设备"))
                    .browser(defaultText(item.getBrowser(), "未知浏览器"))
                    .os(defaultText(item.getOs(), "未知系统"))
                    .loginIp(item.getLoginIp())
                    .loginTime(item.getCreatedAt())
                    .lastActiveAt(item.getLastActiveAt())
                    .expiresAt(item.getExpiresAt())
                    .status(expired ? STATUS_REVOKED : (item.getStatus() == null ? STATUS_REVOKED : item.getStatus()))
                    .current(StringUtils.equals(currentSessionHash, item.getTokenHash()))
                    .build();
        }).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public void revokeSession(String sessionId) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        UserLoginSession session = userLoginSessionMapper.selectOne(new LambdaQueryWrapper<UserLoginSession>()
                .eq(UserLoginSession::getSessionId, sessionId)
                .eq(UserLoginSession::getUserId, userId)
                .eq(UserLoginSession::getDeleted, 0)
                .last("limit 1"));
        if (session == null) {
            throw new BusinessException("登录设备不存在");
        }
        revokeEntity(session);
    }

    @Transactional(rollbackFor = Exception.class)
    public void revokeOtherSessions(String currentToken) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        String currentHash = StringUtils.isBlank(currentToken) ? "" : hashToken(currentToken);
        List<UserLoginSession> sessions = userLoginSessionMapper.selectList(new LambdaQueryWrapper<UserLoginSession>()
                .eq(UserLoginSession::getUserId, userId)
                .eq(UserLoginSession::getDeleted, 0));
        LocalDateTime now = LocalDateTime.now();
        for (UserLoginSession item : sessions) {
            if (StringUtils.equals(currentHash, item.getTokenHash())) {
                continue;
            }
            item.setStatus(STATUS_REVOKED);
            item.setRevokedAt(now);
            userLoginSessionMapper.updateById(item);
        }
    }

    private void revokeEntity(UserLoginSession session) {
        session.setStatus(STATUS_REVOKED);
        session.setRevokedAt(LocalDateTime.now());
        userLoginSessionMapper.updateById(session);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (Exception ex) {
            throw new IllegalStateException("token hash failed", ex);
        }
    }

    private DeviceSnapshot parseRequest(HttpServletRequest request) {
        String userAgent = request == null ? "" : StringUtils.defaultString(request.getHeader("User-Agent"));
        String ua = userAgent.toLowerCase(Locale.ROOT);
        String os = ua.contains("windows") ? "Windows"
                : ua.contains("android") ? "Android"
                : ua.contains("iphone") || ua.contains("ipad") || ua.contains("ios") ? "iOS"
                : ua.contains("mac os") || ua.contains("macintosh") ? "macOS"
                : ua.contains("linux") ? "Linux"
                : "未知系统";
        String browser = ua.contains("edg/") ? "Edge"
                : ua.contains("firefox/") ? "Firefox"
                : ua.contains("chrome/") ? "Chrome"
                : ua.contains("safari/") && !ua.contains("chrome/") ? "Safari"
                : ua.contains("micromessenger") ? "WeChat"
                : "未知浏览器";
        String deviceType = ua.contains("mobile") || ua.contains("android") || ua.contains("iphone") ? "mobile" : "desktop";
        String deviceName = String.format("%s · %s · %s", os, browser, "mobile".equals(deviceType) ? "移动端" : "桌面端");
        return new DeviceSnapshot(deviceType, deviceName, browser, os, extractIp(request));
    }

    private String extractIp(HttpServletRequest request) {
        if (request == null) {
            return "-";
        }
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.isNotBlank(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        return StringUtils.defaultIfBlank(request.getRemoteAddr(), "-");
    }

    private String defaultText(String value, String fallback) {
        return StringUtils.defaultIfBlank(value, fallback);
    }

    private record DeviceSnapshot(String deviceType, String deviceName, String browser, String os, String ip) {
    }
}
