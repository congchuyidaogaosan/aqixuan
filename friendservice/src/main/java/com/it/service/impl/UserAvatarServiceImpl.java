package com.it.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.it.domain.DTO.UserInfoDTO;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.mapper.UserMapper;
import com.it.service.UserAvatarService;
import com.it.mapper.UserAvatarMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 *
 */
@Service
public class UserAvatarServiceImpl extends ServiceImpl<UserAvatarMapper, UserAvatar>
    implements UserAvatarService{

    @Autowired
    private UserAvatarMapper userAvatarMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public User findById(Integer id) {
        QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
        userQueryWrapper.like("id", id);
        List<User> userList = userMapper.selectList(userQueryWrapper);

        for (User user : userList) {

            QueryWrapper<UserAvatar> userAvatarQueryWrapper = new QueryWrapper<>();
            userAvatarQueryWrapper.eq("user_id", user.getId()).orderByAsc("created_at").last("limit 1");
            UserAvatar one = userAvatarMapper.selectOne(userAvatarQueryWrapper);
            user.setHandImg(one.getAvatarUrl());
            return user;
        }

        return null;
    }

    @Override
    public List<String> getAvatarList(Integer id, int i) {
        List<String> strings = new ArrayList<>();
        List<UserAvatar> avatarList = userAvatarMapper.selectList(new QueryWrapper<UserAvatar>().eq("user_id", id).orderByAsc("created_at"));
        for (UserAvatar userAvatar:avatarList){
            strings.add(userAvatar.getAvatarUrl());
        }

        return strings;
    }

    public Result<UserInfoDTO> UserFind(@PathVariable("id") Integer id, HttpSession session) {

        User byId1 = userMapper.selectById(id);
        UserAvatar byId = userAvatarMapper.selectOne(new QueryWrapper<UserAvatar>().eq("user_id",id).orderByDesc("created_at").last("LIMIT 1"));
        UserInfoDTO userInfoDTO=new UserInfoDTO();
        userInfoDTO.setAvatar(byId);
        userInfoDTO.setUser(byId1);
        return Result.ok(userInfoDTO);
    }

}




