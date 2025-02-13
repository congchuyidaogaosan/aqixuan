package com.it.Controller.ws;

import com.alibaba.fastjson.JSON;
import com.it.config.GetHttpSessionConfig;
import com.it.domain.ws.Message;
import com.it.domain.User;
import com.it.domain.ws.ThisMessage;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint(value = "/chat", configurator = GetHttpSessionConfig.class)
@Component
public class ChatEndpoint {

    private static final Map<String, Session> onlineUsers = new ConcurrentHashMap<>();

    private HttpSession httpSession;

    /**
     * 建立webSocket被调用
     *
     * @param session
     */
    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        //将session进行保存

        this.httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());

        User user = (User) this.httpSession.getAttribute("userInfo");

        onlineUsers.put(user.toString(), session);

        //广播消息
        String message = new Message().getMessage(true, null, getFriends());
        broadcastAllUsers(message);

    }


    /**
     * 浏览器发送到服务端时被调用
     *
     * @param message
     */
    @OnMessage
    public void OnMessage(String message) {

        try {
            //将消息给指定用户
            ThisMessage thisMessage = JSON.parseObject(message, ThisMessage.class);
            User user = (User) this.httpSession.getAttribute("userInfo");


            String toName = thisMessage.getToName();
            String message1 = thisMessage.getMessage();

            Session session = onlineUsers.get(toName);
            Set<String> strings = new HashSet<>();
            strings.add(message1);
            String message2 = new Message().getMessage(false, user.getNickname(), strings);

            session.getBasicRemote().sendText(message2);
        } catch (Exception e) {
          
        }

    }


    /**
     * 断开
     *
     * @param session
     */
    @OnClose
    public void onClose(Session session) {
        //剔除用户对象

        User user = (User) this.httpSession.getAttribute("userInfo");
        onlineUsers.remove(user.toString());

        //通知其他所有的  当前用用户下线
        String message = new Message().getMessage(true, null, getFriends());
        broadcastAllUsers(message);


    }

    private void broadcastAllUsers(String message) {

        try {
            Set<Map.Entry<String, Session>> entries = onlineUsers.entrySet();
            for (Map.Entry<String, Session> entry : entries) {
                //获取所有用户的session对象
                Session session = entry.getValue();
                //发送消息
                session.getBasicRemote().sendText(message);


            }
        } catch (Exception e) {
            //记录日志
        }


    }

    public Set<String> getFriends() {
        return onlineUsers.keySet();
    }

}
