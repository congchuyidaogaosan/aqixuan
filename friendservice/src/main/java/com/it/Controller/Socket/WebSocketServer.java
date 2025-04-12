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
     * 接受 浏览器端 socket.send 发送过来的 json数据
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, Session session, @PathParam("username") String username) {
        log.info("服务端收到用户username={}的消息:{}", username, message);
//        JSONObject obj = JSONUtil.parseObj(message);

        JSONObject data = JSONObject.parseObject(message).getJSONObject("data");
        String to = data.getString("content");
        String receiverId = data.getString("receiverId");
        String type = data.getString("messageType");
//        String toUsername = obj.getString("to"); // to表示发送给哪个用户，比如 admin
//        String text = obj.getString("text"); // 发送的消息文本  hello
        // {"to": "admin", "text": "聊天文本"}
        Session toSession = sessionMap.get(receiverId); // 根据 to用户名来获取 session，再通过session发送消息文本
        if (toSession != null) {
            // 服务器端 再把消息组装一下，组装后的消息包含发送人和发送的文本内容
            // {"from": "zhang", "text": "hello"}
            ThisMessage thisMessage = new ThisMessage();

            thisMessage.setMessage(to);
            thisMessage.setReceiverId(Integer.valueOf(receiverId));
            thisMessage.setSenderId(Integer.valueOf(username));
            thisMessage.setType(type);

            String json = new JSONObject().toJSONString(thisMessage);

//
            boolean b = chatMessageService.addOne(thisMessage, username);
            System.out.println(b);
            if (b) {
                this.sendMessage(json, toSession);
            } else {
                log.info("发送失败，数据库保存失败", to);
            }

        } else {
            log.info("发送失败，未找到用户username={}的session", username);
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        log.error("发生错误");
        error.printStackTrace();
    }

    /**
     * 服务端发送消息给客户端
     */
    private void sendMessage(String message, Session toSession) {
        try {
            log.info("服务端给客户端[{}]发送消息{}", toSession.getId(), message);
            toSession.getBasicRemote().sendText(message);
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
                log.info("服务端给客户端[{}]发送消息{}", session.getId(), message);
                session.getBasicRemote().sendText(message);
            }
        } catch (Exception e) {
            log.error("服务端发送消息给客户端失败", e);
        }
    }
}
