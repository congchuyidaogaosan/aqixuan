package com.it.domain.DTO;

import com.it.domain.User;
import com.it.domain.UserAvatar;
import lombok.Data;

import java.util.List;

@Data
public class UserInfoDTO {



    private User user;

    private UserAvatar avatar;

    private List<String> url;
}
