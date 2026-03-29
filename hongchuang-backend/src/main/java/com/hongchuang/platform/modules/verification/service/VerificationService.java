package com.hongchuang.platform.modules.verification.service;

import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.modules.verification.vo.CaptchaVO;
import com.hongchuang.platform.modules.verification.vo.EmailCodeSendVO;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private record CaptchaCache(String code, LocalDateTime expireAt) {}
    private record EmailCache(String code, LocalDateTime expireAt) {}
    private record CooldownCache(LocalDateTime nextAllowedAt) {}

    private final MailSupportService mailSupportService;

    private final Map<String, CaptchaCache> captchaCache = new ConcurrentHashMap<>();
    private final Map<String, EmailCache> emailCodeCache = new ConcurrentHashMap<>();
    private final Map<String, CooldownCache> emailCooldownCache = new ConcurrentHashMap<>();

    @Value("${hc.verification.captcha-expire-minutes:5}")
    private long captchaExpireMinutes;
    @Value("${hc.verification.email-code-expire-minutes:10}")
    private long emailCodeExpireMinutes;
    @Value("${hc.verification.email-code-cooldown-seconds:60}")
    private long emailCodeCooldownSeconds;

    public CaptchaVO generateCaptcha() {
        cleanup();
        String id = UUID.randomUUID().toString().replace("-", "");
        String code = RandomStringUtils.randomAlphanumeric(4).toUpperCase();
        captchaCache.put(id, new CaptchaCache(code, LocalDateTime.now().plusMinutes(captchaExpireMinutes)));

        String svg = "<svg xmlns='http://www.w3.org/2000/svg' width='132' height='44' viewBox='0 0 132 44'>" +
                "<rect width='132' height='44' rx='10' fill='#0f172a'/>" +
                "<path d='M8 34 Q 22 10 36 26 T 64 22 T 96 28 T 124 18' stroke='#22c55e' stroke-width='2' fill='none' opacity='0.35'/>" +
                "<text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' font-weight='700' fill='#e5f7ff' letter-spacing='4'>" + escapeXml(code) + "</text>" +
                "</svg>";
        String base64 = Base64.getEncoder().encodeToString(svg.getBytes(StandardCharsets.UTF_8));
        return CaptchaVO.builder().captchaId(id).imageBase64("data:image/svg+xml;base64," + base64).build();
    }

    public void validateCaptcha(String captchaId, String captchaCode) {
        cleanup();
        CaptchaCache cache = captchaCache.get(captchaId);
        if (cache == null || cache.expireAt().isBefore(LocalDateTime.now())) {
            captchaCache.remove(captchaId);
            throw new BusinessException("图形验证码已过期，请刷新后重试");
        }
        if (!cache.code().equalsIgnoreCase(captchaCode == null ? "" : captchaCode.trim())) {
            throw new BusinessException("图形验证码错误");
        }
        captchaCache.remove(captchaId);
    }

    public EmailCodeSendVO sendEmailCode(String bizType, String email) {
        cleanup();
        String cooldownKey = cacheKey(bizType, email);
        CooldownCache cooldown = emailCooldownCache.get(cooldownKey);
        if (cooldown != null && cooldown.nextAllowedAt().isAfter(LocalDateTime.now())) {
            long left = Duration.between(LocalDateTime.now(), cooldown.nextAllowedAt()).toSeconds();
            throw new BusinessException(429, "验证码发送过于频繁，请 " + Math.max(left, 1) + " 秒后再试");
        }

        String code = RandomStringUtils.randomNumeric(6);
        emailCodeCache.put(cooldownKey, new EmailCache(code, LocalDateTime.now().plusMinutes(emailCodeExpireMinutes)));
        emailCooldownCache.put(cooldownKey, new CooldownCache(LocalDateTime.now().plusSeconds(emailCodeCooldownSeconds)));
        mailSupportService.sendCode(email, bizType, code);
        return EmailCodeSendVO.builder()
                .sent(true)
                .message(mailSupportService.canSend() ? "验证码已发送到邮箱" : "当前未配置邮件服务，已返回调试验证码")
                .debugCode(mailSupportService.canSend() ? null : code)
                .cooldownSeconds((int) emailCodeCooldownSeconds)
                .build();
    }

    public void validateEmailCode(String bizType, String email, String code) {
        cleanup();
        EmailCache cache = emailCodeCache.get(cacheKey(bizType, email));
        if (cache == null || cache.expireAt().isBefore(LocalDateTime.now())) {
            emailCodeCache.remove(cacheKey(bizType, email));
            throw new BusinessException("邮箱验证码无效或已过期");
        }
        if (!cache.code().equals((code == null ? "" : code.trim()))) {
            throw new BusinessException("邮箱验证码错误");
        }
        emailCodeCache.remove(cacheKey(bizType, email));
    }

    private String cacheKey(String bizType, String email) {
        return bizType.trim().toUpperCase() + ":" + email.trim().toLowerCase();
    }

    private String escapeXml(String text) {
        return text == null ? "" : text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&apos;");
    }

    private void cleanup() {
        LocalDateTime now = LocalDateTime.now();
        captchaCache.entrySet().removeIf(e -> e.getValue().expireAt().isBefore(now));
        emailCodeCache.entrySet().removeIf(e -> e.getValue().expireAt().isBefore(now));
        emailCooldownCache.entrySet().removeIf(e -> e.getValue().nextAllowedAt().isBefore(now));
    }
}
