package com.it;

import com.it.Controller.Socket.WebSocketServer;
import org.apache.catalina.core.ApplicationContext;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
@MapperScan(basePackages = "com.it.mapper")
public class myBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(myBootApplication.class, args);


//        ConfigurableApplicationContext configurableApplicationContext = springApplication.run(args);
//        WebSocketServer.setApplicationContext((ApplicationContext) configurableApplicationContext);
    }

}
