package com.it.Controller.Socket;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.it.domain.ChatMessage;
import com.it.domain.ws.ThisMessage;
import com.it.service.ChatMessageService;
import com.it.service.impl.ChatMessageServiceImpl;
import org.apache.catalina.core.ApplicationContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Date;

/**
 * @author websocket服务
 */
@ServerEndpoint(value = "/imserver/{username}")
//@Component
@Service
public class WebSocketServer {
    private static final Logger log = LoggerFactory.getLogger(WebSocketServer.class);
    /**
     * 记录当前在线连接数
     */
    public static final Map<String, Session> sessionMap = new ConcurrentHashMap<>();
//
//    private static ApplicationContext applicationContext;
//
//
//    public static void setApplicationContext(ApplicationContext applicationContext) {
//        WebSocketServer.applicationContext = applicationContext;
//    }
    @Autowired
    public  void  setChatMessageService(ChatMessageService chatMessageService){
        WebSocketServer.chatMessageService = chatMessageService;
    }



    private static   ChatMessageService chatMessageService;

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) {
        sessionMap.put(username, session);
        log.info("有新用户加入，username={}, 当前在线人数为：{}", username, sessionMap.size());
        HashMap<String, Object> hashMap = new HashMap<>();
        JSONArray array = new JSONArray();
        hashMap.put("users", array);
        for (Object key : sessionMap.keySet()) {
//            JSONObject jsonObject = new JSONObject();
            HashMap<String, Object> hashMap1 = new HashMap<>();
            hashMap1.put("username", key);
            // {"username", "zhang", "username": "admin"}
            array.add(hashMap1);
        }
//        {"users": [{"username": "zhang"},{ "username": "admin"}]}
        sendAllMessage(JSONObject.toJSONString(hashMap));  // 后台发送消息给所有的客户端
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(Session session, @PathParam("username") String username) {
        sessionMap.remove(username);
        log.info("有一连接关闭，移除username={}的用户session, 当前在线人数为：{}", username, sessionMap.size());
    }

    /**
     * 收到客户端消息后调用的方法
     * 后台收到客户端发送过来的消息
     * onMessage 是一个消息的中转站
     * 接收客户端发送过来的消息并转发给目标用户
     *
     * @param message 客户端发送过来的消息
     * @param session 当前用户的WebSocket会话
     * @param username 当前用户名（发送者ID）
     */
    @OnMessage
    public void onMessage(String message, Session session, @PathParam("username") String username) {
        log.info("服务端收到用户username={}的消息:{}", username, message);
        
        try {
            // 解析消息，获取消息数据
            JSONObject jsonObject = JSONObject.parseObject(message);
            
            // 获取消息中的data字段
            if (!jsonObject.containsKey("data")) {
                log.error("消息格式错误，缺少data字段: {}", message);
                return;
            }
            
            JSONObject data = jsonObject.getJSONObject("data");
            
            // 验证必要字段是否存在
            if (!data.containsKey("content") || !data.containsKey("receiverId") || !data.containsKey("messageType")) {
                log.error("消息格式错误，缺少必要字段: {}", data);
                return;
            }
            
            // 获取消息内容和接收者ID
            String content = data.getString("content");
            String receiverId = data.getString("receiverId");
            String messageType = data.getString("messageType");
            
            // 创建消息对象
            ThisMessage thisMessage = new ThisMessage();
            thisMessage.setMessage(content);
            try {
                thisMessage.setReceiverId(Integer.valueOf(receiverId));
                thisMessage.setSenderId(Integer.valueOf(username));
            } catch (NumberFormatException e) {
                log.error("用户ID格式错误: senderId={}, receiverId={}", username, receiverId, e);
                return;
            }
            
            thisMessage.setType(messageType);
            thisMessage.setThisTime(new Date()); // 设置消息时间
            
            // 获取接收者的会话
            Session receiverSession = sessionMap.get(receiverId);
            
            // 保存消息到数据库
            boolean saveSuccess = false;
            try {
                saveSuccess = chatMessageService.addOne(thisMessage, username);
                if (!saveSuccess) {
                    log.error("保存消息到数据库失败: {}", thisMessage);
                }
            } catch (Exception e) {
                log.error("保存消息时发生异常", e);
            }
            
            // 消息发送
            if (saveSuccess) {
                // 将消息转为JSON字符串
                String jsonMessage = JSON.toJSONString(thisMessage);
                
                // 如果接收者在线，直接发送消息
                if (receiverSession != null && receiverSession.isOpen()) {
                    sendMessage(jsonMessage, receiverSession);
                    log.info("消息已发送给用户: {}", receiverId);
                } else {
                    // 用户不在线，消息将在下次登录时通过历史记录获取
                    log.info("用户{}不在线，消息已保存到数据库", receiverId);
                }
            }
        } catch (Exception e) {
            log.error("处理消息时发生异常: {}", message, e);
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        log.error("WebSocket发生错误: {}", error.getMessage(), error);
    }

    /**
     * 服务端发送消息给客户端
     */
    private void sendMessage(String message, Session toSession) {
        try {
            if (toSession != null && toSession.isOpen()) {
                log.info("服务端给客户端[{}]发送消息: {}", toSession.getId(), message);
                toSession.getBasicRemote().sendText(message);
            } else {
                log.warn("无法发送消息，会话已关闭或为null");
            }
        } catch (Exception e) {
            log.error("服务端发送消息给客户端失败", e);
        }
    }

    /**
     * 服务端发送消息给所有客户端
     */
    private void sendAllMessage(String message) {
        try {
            for (Session session : sessionMap.values()) {
                if (session.isOpen()) {
                    log.info("服务端给客户端[{}]发送消息: {}", session.getId(), message);
                    session.getBasicRemote().sendText(message);
                }
            }
        } catch (Exception e) {
            log.error("服务端发送全局消息失败", e);
        }
    }
}
