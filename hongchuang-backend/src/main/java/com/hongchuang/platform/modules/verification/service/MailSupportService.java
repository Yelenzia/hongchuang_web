package com.hongchuang.platform.modules.verification.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailSupportService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final Environment environment;

    public boolean canSend() {
        return mailSenderProvider.getIfAvailable() != null
                && StringUtils.isNotBlank(environment.getProperty("spring.mail.host"))
                && StringUtils.isNotBlank(environment.getProperty("spring.mail.username"))
                && StringUtils.isNotBlank(environment.getProperty("spring.mail.password"));
    }

    public void sendCode(String email, String bizType, String code) {
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null || !canSend()) {
            log.warn("Mail not configured. email={}, bizType={}, code={}", email, bizType, code);
            return;
        }
        try {
            String fromEmail = environment.getProperty("mail.from-email",
                    environment.getProperty("spring.mail.username", "no-reply@hongchuang.local"));
            String fromName = environment.getProperty("mail.from-name", "宏创工作室邮箱服务");
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(email);
            helper.setSubject("鸿创工作室验证码 - " + bizType);
            helper.setText("您好，您的验证码是：" + code + "，10 分钟内有效。若非本人操作请忽略。", false);
            message.setFrom(new InternetAddress(fromEmail, fromName, "UTF-8"));
            sender.send(message);
        } catch (Exception e) {
            log.error("Send mail failed. email={}, bizType={}", email, bizType, e);
            throw new RuntimeException("邮件发送失败，请稍后再试");
        }
    }
}
