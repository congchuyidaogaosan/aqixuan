package com.it.service;

import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 *
 */
public interface UserAvatarService extends IService<UserAvatar> {

    User findById(Integer id);

    List<String> getAvatarList(Integer id, int i);
}
