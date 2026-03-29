package com.hongchuang.platform.security.jwt;

import com.hongchuang.platform.modules.session.service.UserLoginSessionService;
import com.hongchuang.platform.security.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final StringRedisTemplate stringRedisTemplate;
    private final UserLoginSessionService userLoginSessionService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
                                   CustomUserDetailsService userDetailsService,
                                   StringRedisTemplate stringRedisTemplate,
                                   UserLoginSessionService userLoginSessionService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
        this.stringRedisTemplate = stringRedisTemplate;
        this.userLoginSessionService = userLoginSessionService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.isNotBlank(authorization) && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            if (isBlacklisted(token) || !userLoginSessionService.isTokenActive(token)) {
                filterChain.doFilter(request, response);
                return;
            }
            if (jwtTokenProvider.validate(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
                Long userId = jwtTokenProvider.getUserId(token);
                var userDetails = userDetailsService.loadByUserId(userId);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                userLoginSessionService.touchSession(token, request);
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean isBlacklisted(String token) {
        try {
            return Boolean.TRUE.equals(stringRedisTemplate.hasKey("auth:blacklist:" + token));
        } catch (Exception ex) {
            log.warn("Redis unavailable when checking token blacklist, request will continue. message={}", ex.getMessage());
            return false;
        }
    }
}
