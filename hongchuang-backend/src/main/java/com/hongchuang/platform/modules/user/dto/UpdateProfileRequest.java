package com.hongchuang.platform.modules.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @Size(min = 2, max = 32, message = "昵称长度需在2到32之间")
    private String nickname;

    @Size(max = 255, message = "头像地址过长")
    private String avatarUrl;

    @Size(max = 120, message = "个性签名过长")
    private String signature;

    @Size(max = 255, message = "简介过长")
    private String bio;
}
