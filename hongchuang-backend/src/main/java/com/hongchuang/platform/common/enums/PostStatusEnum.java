package com.hongchuang.platform.common.enums;

import lombok.Getter;

@Getter
public enum PostStatusEnum {
    PUBLISHED(1),
    PENDING(2),
    OFFLINE(3),
    DELETED(4);

    private final int code;

    PostStatusEnum(int code) {
        this.code = code;
    }
}
