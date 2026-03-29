package com.hongchuang.platform.common.exception;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.common.api.ResultCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusiness(BusinessException ex, HttpServletRequest request) {
        log.warn("BusinessException uri={}, message={}", request.getRequestURI(), ex.getMessage());
        return Result.failed(ex.getCode(), ex.getMessage());
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class, ConstraintViolationException.class})
    public Result<Void> handleValidation(Exception ex, HttpServletRequest request) {
        log.warn("ValidationException uri={}, message={}", request.getRequestURI(), ex.getMessage());
        return Result.failed(ResultCode.VALIDATE_FAILED.getCode(), "参数校验失败");
    }

    @ExceptionHandler(BadCredentialsException.class)
    public Result<Void> handleBadCredentials(BadCredentialsException ex) {
        return Result.failed(ResultCode.UNAUTHORIZED.getCode(), "账号或密码错误");
    }

    @ExceptionHandler(AuthenticationException.class)
    public Result<Void> handleAuth(AuthenticationException ex) {
        return Result.failed(ResultCode.UNAUTHORIZED.getCode(), "认证失败");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Result<Void> handleAccessDenied(AccessDeniedException ex) {
        return Result.failed(ResultCode.FORBIDDEN.getCode(), ResultCode.FORBIDDEN.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception ex, HttpServletRequest request) {
        log.error("SystemException uri={}, message={}", request.getRequestURI(), ex.getMessage(), ex);
        return Result.failed(ResultCode.FAILED.getCode(), ResultCode.FAILED.getMessage());
    }
}
