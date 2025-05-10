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
@Component
@Service
public class WebSocketServer {
    private static final Logger log = LoggerFactory.getLogger(WebSocketServer.class);
    /**
     * 记录当前在线连接数
     */
    public static final Map<String, Session> sessionMap = new ConcurrentHashMap<>();

    @Autowired
    public void setChatMessageService(ChatMessageService chatMessageService){
        WebSocketServer.chatMessageService = chatMessageService;
        log.info("WebSocketServer注入ChatMessageService成功");
    }

    private static ChatMessageService chatMessageService;

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) {
        try {
            log.info("新WebSocket连接，用户ID: {}, 会话ID: {}", username, session.getId());
            
            // 先移除可能存在的旧会话
            if (sessionMap.containsKey(username)) {
                log.info("用户已有连接，替换为新连接: {}", username);
                Session oldSession = sessionMap.get(username);
                try {
                    oldSession.close();
                } catch (Exception e) {
                    log.warn("关闭旧连接时出错", e);
                }
            }
            
            // 保存新会话
            sessionMap.put(username, session);
            log.info("当前在线用户数: {}", sessionMap.size());
            
            // 回复欢迎消息
            ThisMessage welcomeMsg = new ThisMessage();
            welcomeMsg.setType("system");
            welcomeMsg.setMessage("WebSocket连接成功");
            welcomeMsg.setThisTime(new Date());
            sendMessage(JSON.toJSONString(welcomeMsg), session);
            
            // 广播用户在线状态
            HashMap<String, Object> onlineStatus = new HashMap<>();
            onlineStatus.put("type", "userStatus");
            onlineStatus.put("users", sessionMap.keySet());
            onlineStatus.put("count", sessionMap.size());
            sendAllMessage(JSON.toJSONString(onlineStatus));
            
        } catch (Exception e) {
            log.error("建立WebSocket连接时发生错误", e);
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(Session session, @PathParam("username") String username) {
        try {
            sessionMap.remove(username);
            log.info("WebSocket连接关闭，用户ID: {}, 当前在线用户数: {}", username, sessionMap.size());
            
            // 广播用户离线状态
            HashMap<String, Object> offlineStatus = new HashMap<>();
            offlineStatus.put("type", "userStatus");
            offlineStatus.put("users", sessionMap.keySet());
            offlineStatus.put("count", sessionMap.size());
            sendAllMessage(JSON.toJSONString(offlineStatus));
            
        } catch (Exception e) {
            log.error("关闭WebSocket连接时发生错误", e);
        }
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
        log.info("服务端收到用户{}的消息: {}", username, message);
        
        // 回复消息接收确认
        ThisMessage ackMessage = new ThisMessage();
        ackMessage.setType("ack");
        ackMessage.setMessage("消息已收到");
        ackMessage.setThisTime(new Date());
        sendMessage(JSON.toJSONString(ackMessage), session);
        
        try {
            // 解析消息，获取消息数据
            JSONObject jsonObject;
            try {
                jsonObject = JSONObject.parseObject(message);
                if (jsonObject == null) {
                    log.error("消息格式错误，无法解析JSON: {}", message);
                    sendErrorMessage(session, "消息格式错误，无法解析JSON");
                    return;
                }
            } catch (Exception e) {
                log.error("解析消息JSON时发生异常: {}", message, e);
                sendErrorMessage(session, "消息格式错误: " + e.getMessage());
                return;
            }
            
            // 处理心跳消息
            if (jsonObject.containsKey("type") && "heartbeat".equals(jsonObject.getString("type"))) {
                log.debug("收到用户{}的心跳消息", username);
                ThisMessage heartbeatResponse = new ThisMessage();
                heartbeatResponse.setType("heartbeat");
                heartbeatResponse.setMessage("pong");
                heartbeatResponse.setThisTime(new Date());
                sendMessage(JSON.toJSONString(heartbeatResponse), session);
                return;
            }
            
            // 获取消息中的data字段
            if (!jsonObject.containsKey("data")) {
                log.error("消息格式错误，缺少data字段: {}", message);
                sendErrorMessage(session, "消息格式错误，缺少data字段");
                return;
            }
            
            JSONObject data;
            try {
                data = jsonObject.getJSONObject("data");
            } catch (Exception e) {
                log.error("data字段不是有效的JSON对象: {}", message, e);
                sendErrorMessage(session, "data字段不是有效的JSON对象");
                return;
            }
            
            // 验证必要字段是否存在
            if (!data.containsKey("content") || !data.containsKey("receiverId") || !data.containsKey("messageType")) {
                log.error("消息缺少必要字段: {}", data);
                sendErrorMessage(session, "消息缺少必要字段");
                return;
            }
            
            // 获取消息内容和接收者ID
            String content = data.getString("content");
            String receiverId = data.getString("receiverId");
            String messageType = data.getString("messageType");
            
            log.info("解析后的消息数据: 接收者={}, 类型={}, 内容长度={}", receiverId, messageType, content.length());
            
            // 创建消息对象
            ThisMessage thisMessage = new ThisMessage();
            thisMessage.setMessage(content);
            try {
                thisMessage.setReceiverId(Integer.valueOf(receiverId));
                thisMessage.setSenderId(Integer.valueOf(username));
            } catch (NumberFormatException e) {
                log.error("用户ID格式错误: senderId={}, receiverId={}", username, receiverId, e);
                sendErrorMessage(session, "用户ID格式错误");
                return;
            }
            
            thisMessage.setType(messageType);
            thisMessage.setThisTime(new Date()); // 设置消息时间
            
            // 获取接收者的会话
            Session receiverSession = sessionMap.get(receiverId);
            
            // 保存消息到数据库
            boolean saveSuccess = false;
            try {
                if (chatMessageService == null) {
                    log.error("ChatMessageService未注入，无法保存消息");
                    sendErrorMessage(session, "服务器内部错误: ChatMessageService未注入");
                    return;
                }
                
                saveSuccess = chatMessageService.addOne(thisMessage, username);
                if (!saveSuccess) {
                    log.error("保存消息到数据库失败: {}", thisMessage);
                    sendErrorMessage(session, "保存消息失败");
                }
            } catch (Exception e) {
                log.error("保存消息时发生异常", e);
                sendErrorMessage(session, "保存消息时发生异常: " + e.getMessage());
                return;
            }
            
            // 消息发送
            if (saveSuccess) {
                // 将消息转为JSON字符串
                String jsonMessage = JSON.toJSONString(thisMessage);
                
                log.info("准备发送消息给接收者: {}, 消息内容: {}", receiverId, jsonMessage);
                
                // 如果接收者在线，直接发送消息
                if (receiverSession != null && receiverSession.isOpen()) {
                    sendMessage(jsonMessage, receiverSession);
                    log.info("消息已发送给在线用户: {}", receiverId);
                    
                    // 发送给发送者的消息发送成功确认
                    ThisMessage sendSuccess = new ThisMessage();
                    sendSuccess.setType("sendSuccess");
                    sendSuccess.setMessage("消息已发送");
                    sendSuccess.setThisTime(new Date());
                    sendSuccess.setReceiverId(Integer.valueOf(receiverId));
                    sendMessage(JSON.toJSONString(sendSuccess), session);
                } else {
                    // 用户不在线，消息将在下次登录时通过历史记录获取
                    log.info("用户{}不在线，消息已保存到数据库", receiverId);
                    
                    // 发送给发送者的离线消息确认
                    ThisMessage offlineMsg = new ThisMessage();
                    offlineMsg.setType("offlineMessage");
                    offlineMsg.setMessage("接收者不在线，消息已保存");
                    offlineMsg.setThisTime(new Date());
                    offlineMsg.setReceiverId(Integer.valueOf(receiverId));
                    sendMessage(JSON.toJSONString(offlineMsg), session);
                }
            }
        } catch (Exception e) {
            log.error("处理消息时发生异常: {}", message, e);
            sendErrorMessage(session, "处理消息时发生异常: " + e.getMessage());
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        log.error("WebSocket发生错误: {}", error.getMessage(), error);
        try {
            if (session.isOpen()) {
                ThisMessage errorMsg = new ThisMessage();
                errorMsg.setType("error");
                errorMsg.setMessage("WebSocket连接错误: " + error.getMessage());
                errorMsg.setThisTime(new Date());
                sendMessage(JSON.toJSONString(errorMsg), session);
            }
        } catch (Exception e) {
            log.error("发送错误消息失败", e);
        }
    }

    /**
     * 发送错误消息给客户端
     */
    private void sendErrorMessage(Session session, String errorMessage) {
        try {
            if (session != null && session.isOpen()) {
                ThisMessage errorMsg = new ThisMessage();
                errorMsg.setType("error");
                errorMsg.setMessage(errorMessage);
                errorMsg.setThisTime(new Date());
                sendMessage(JSON.toJSONString(errorMsg), session);
            }
        } catch (Exception e) {
            log.error("发送错误消息失败", e);
        }
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
                    log.info("服务端给客户端[{}]发送全局消息", session.getId());
                    session.getBasicRemote().sendText(message);
                }
            }
        } catch (Exception e) {
            log.error("服务端发送全局消息失败", e);
        }
    }
}
