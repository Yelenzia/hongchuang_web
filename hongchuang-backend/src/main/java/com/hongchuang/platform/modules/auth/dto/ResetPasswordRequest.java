package com.hongchuang.platform.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String code;

    @NotBlank
    @Size(min = 8, max = 64)
    private String newPassword;

    @NotBlank
    private String confirmPassword;

    @NotBlank
    private String captchaId;

    @NotBlank
    private String captchaCode;
}
