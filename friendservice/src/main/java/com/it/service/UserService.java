package com.it.service;

import com.it.domain.DTO.UserDTO;
import com.it.domain.User;
import com.baomidou.mybatisplus.extension.service.IService;
import com.it.domain.common.Result;

import java.util.List;

/**
 *
 */
public interface UserService extends IService<User> {

    Boolean isUserPhone(String phone);

    Result infoUserPhone(String phone);


    List<UserDTO> joinUserAvatar(List<Integer> list);

     List<UserDTO> joinUserAvatar();
}
