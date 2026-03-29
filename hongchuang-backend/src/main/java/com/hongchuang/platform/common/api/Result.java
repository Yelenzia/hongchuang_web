package com.hongchuang.platform.common.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;

    public static <T> Result<T> success(T data) {
        return Result.<T>builder()
                .code(ResultCode.SUCCESS.getCode())
                .message(ResultCode.SUCCESS.getMessage())
                .data(data)
                .requestId(java.util.UUID.randomUUID().toString())
                .build();
    }

    public static <T> Result<T> success(String message, T data) {
        return Result.<T>builder()
                .code(ResultCode.SUCCESS.getCode())
                .message(message)
                .data(data)
                .requestId(java.util.UUID.randomUUID().toString())
                .build();
    }

    public static <T> Result<T> failed(ResultCode resultCode) {
        return Result.<T>builder()
                .code(resultCode.getCode())
                .message(resultCode.getMessage())
                .requestId(java.util.UUID.randomUUID().toString())
                .build();
    }

    public static <T> Result<T> failed(Integer code, String message) {
        return Result.<T>builder()
                .code(code)
                .message(message)
                .requestId(java.util.UUID.randomUUID().toString())
                .build();
    }
}
