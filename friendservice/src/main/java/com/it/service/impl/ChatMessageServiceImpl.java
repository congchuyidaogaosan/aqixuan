package com.it.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.it.domain.ChatMessage;
import com.it.domain.ws.ThisMessage;
import com.it.service.ChatMessageService;
import com.it.mapper.ChatMessageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 *
 */
@Service
public class ChatMessageServiceImpl extends ServiceImpl<ChatMessageMapper, ChatMessage>
    implements ChatMessageService{

    @Autowired
    private ChatMessageMapper chatMessageMapper;

    @Override
    public boolean addOne(ThisMessage thisMessage, String username) {

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(thisMessage.getMessage());
        chatMessage.setReceiverId(username);
        chatMessage.setSenderId(thisMessage.getSenderId()+"");
        chatMessage.setMessageType(thisMessage.getType());
        chatMessage.setCreatedAt(new Date());

        return chatMessageMapper.insert(chatMessage) != 0;


    }
}




