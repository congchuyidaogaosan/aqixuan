package com.it.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import com.it.domain.DTO.UserDTO;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.UserService;
import com.it.mapper.UserMapper;
import com.it.utill.GenerateRandomNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
        implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private GenerateRandomNumber generateRandomNumber;

    @Override
    public List<UserDTO> joinUserAvatar(List<Integer> list) {
        MPJLambdaWrapper<User> wrapper =new MPJLambdaWrapper<User>();
        wrapper.selectAll(User.class).select("avatar_url").leftJoin(UserAvatar.class,UserAvatar::getUserId,User::getId);
        wrapper.orderByAsc("created_at").last("LIMIT 1");
        for (Integer integer:list){
            wrapper.in("t.id",integer);
        }


        List<UserDTO> objects = userMapper.selectJoinList(UserDTO.class,wrapper);

        return objects;
    }

    @Override
    public List<UserDTO> joinUserAvatar() {
        MPJLambdaWrapper<User> wrapper =new MPJLambdaWrapper<User>();
        wrapper.selectAll(User.class).select("avatar_url").leftJoin(UserAvatar.class,UserAvatar::getUserId,User::getId);

        wrapper.orderByAsc("updated_at");

        List<UserDTO> objects = userMapper.selectJoinList(UserDTO.class,wrapper);

        return objects;
    }

    @Override
    public Boolean isUserPhone(String phone) {
        QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
        userQueryWrapper.eq("phone", phone);
        List<User> users = userMapper.selectList(userQueryWrapper);
        if (users.size() == 1) {
            return true;
        }
        return false;
    }


    @Override
    public Result infoUserPhone(String phone) {
        Boolean userPhone = isUserPhone(phone);
        if (!userPhone) {
            User user = new User();
            user.setPhone(phone);
            user.setNickname("用户"+generateRandomNumber.getRandoNumber(6));
            int insert = userMapper.insert(user);
            return Result.ok();
        }
        return Result.fail("账户已存在");
    }

}




