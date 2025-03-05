package com.it.service;

import com.it.domain.ChatMessage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.it.domain.ws.ThisMessage;

/**
 *
 */
public interface ChatMessageService extends IService<ChatMessage> {

    boolean addOne(ThisMessage thisMessage, String username);
}
