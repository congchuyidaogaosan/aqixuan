package com.it.service;

import com.it.domain.User;
import com.baomidou.mybatisplus.extension.service.IService;
import com.it.domain.common.Result;

/**
 *
 */
public interface UserService extends IService<User> {

    Boolean isUserPhone(String phone);

     Result infoUserPhone(String phone);
}
