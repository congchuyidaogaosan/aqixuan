package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.UserAvatarService;
import com.it.service.UserService;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RequestMapping("user")
@RestController
public class UserController {


    @Autowired
    private UserService userService;

    @Autowired
    private UserAvatarService userAvatarService;

    @Autowired
    private TokenUtil tokenUtil;


    @RequestMapping("list")
    public Result list(@RequestBody User user) {

        QueryWrapper<UserAvatar> userAvatarQueryWrapper = new QueryWrapper<>();
        if (user.getNickname() != null && !user.getNickname().isEmpty()) {
            userAvatarQueryWrapper.like("nick_Name", user.getNickname());
        }

        List<User> list = userService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id) {
        User byId = userService.getById(id);
        return Result.ok(byId);
    }

    // 按照昵称搜索
    @GetMapping("findByName")
    public Result findByName(@RequestParam String nickname) {

        QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
        userQueryWrapper.like("nickname", nickname);
        List<User> userList = userService.list(userQueryWrapper);

        for (User user : userList) {

            QueryWrapper<UserAvatar> userAvatarQueryWrapper = new QueryWrapper<>();
            userAvatarQueryWrapper.eq("user_id", user.getId()).orderByDesc("created_at").last("limit 1");
            UserAvatar one = userAvatarService.getOne(userAvatarQueryWrapper);
            user.setHandImg(one.getAvatarUrl());
        }

        return Result.ok(userList);

    }




    @PostMapping("update")
    public Result update(@RequestBody User user, HttpServletRequest request) {
        //更新
        String token = request.getHeader("token");

        Map<String, String> stringStringMap = tokenUtil.parseToken(token);

        String userId = stringStringMap.get("userId");

        user.setId(Integer.valueOf(userId));

        boolean b = userService.updateById(user);
        User byId = userService.getById(user.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = userService.removeById(id);
        return Result.ok();
    }
}
