package com.it.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * WebSocket配置类
 * 用于注册WebSocket端点
 */
@Configuration
public class WebSocketConfig {
    
    /**
     * 注册ServerEndpointExporter，这个bean会自动注册使用了@ServerEndpoint注解声明的WebSocket端点
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
} 