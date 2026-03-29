package com.hongchuang.platform.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CancelAccountRequest {

    @NotBlank(message = "当前密码不能为空")
    private String password;

    @NotBlank(message = "邮箱验证码不能为空")
    private String emailCode;

    @NotBlank(message = "图形验证码不能为空")
    private String captchaCode;

    @NotBlank(message = "captchaId 不能为空")
    private String captchaId;

    @Size(max = 200, message = "注销原因不能超过 200 字")
    private String reason;
}
