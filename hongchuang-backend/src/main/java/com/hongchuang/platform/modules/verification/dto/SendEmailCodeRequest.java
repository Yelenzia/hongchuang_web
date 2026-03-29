package com.hongchuang.platform.modules.verification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendEmailCodeRequest {
    @NotBlank
    private String bizType;
    private String email;
    private String account;
    @NotBlank
    private String captchaId;
    @NotBlank
    private String captchaCode;
}
