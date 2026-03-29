package com.hongchuang.platform;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.hongchuang.platform.modules")
@SpringBootApplication
public class HongChuangApplication {
    public static void main(String[] args) {
        SpringApplication.run(HongChuangApplication.class, args);
    }
}
