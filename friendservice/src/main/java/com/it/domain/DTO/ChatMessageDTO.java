package com.it.domain.DTO;

import com.it.domain.ChatMessage;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {

    private ChatMessage chatMessage;

    private UserAvatar userAvatar;

    private User user;

    public ChatMessageDTO(UserInfoDTO userInfoDTOResult, ChatMessage chatMessage) {
        this.chatMessage = chatMessage;
        this.userAvatar = userInfoDTOResult.getAvatar();
        this.user = userInfoDTOResult.getUser();
    }
}
