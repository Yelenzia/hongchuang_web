package com.hongchuang.platform.common.enums;

import lombok.Getter;

@Getter
public enum UserStatusEnum {
    NORMAL(1),
    BANNED(2),
    CANCELLING(3),
    CANCELLED(4);

    private final int code;

    UserStatusEnum(int code) {
        this.code = code;
    }
}
