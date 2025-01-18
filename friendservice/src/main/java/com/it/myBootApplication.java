package com.it;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "com.it.mapper")
public class myBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(myBootApplication.class, args);
    }

}
