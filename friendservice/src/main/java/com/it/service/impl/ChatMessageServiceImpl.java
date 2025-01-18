package com.it.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.it.domain.ChatMessage;
import com.it.service.ChatMessageService;
import com.it.mapper.ChatMessageMapper;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class ChatMessageServiceImpl extends ServiceImpl<ChatMessageMapper, ChatMessage>
    implements ChatMessageService{

}




