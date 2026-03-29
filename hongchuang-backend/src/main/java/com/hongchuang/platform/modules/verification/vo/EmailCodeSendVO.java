package com.hongchuang.platform.modules.verification.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailCodeSendVO {
    private Boolean sent;
    private String message;
    private String debugCode;
    private Integer cooldownSeconds;
}
