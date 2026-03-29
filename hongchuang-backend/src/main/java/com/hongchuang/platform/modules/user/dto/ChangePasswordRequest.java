package com.hongchuang.platform.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank
    private String oldPassword;

    @NotBlank
    @Size(min = 8, max = 64)
    private String newPassword;

    @NotBlank
    private String confirmPassword;

    @NotBlank
    private String emailCode;

    @NotBlank
    private String captchaId;

    @NotBlank
    private String captchaCode;
}
