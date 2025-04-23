package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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
import java.util.ArrayList;
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


    @GetMapping("list")
    public Result list(
        @RequestParam(defaultValue = "1") Integer current,
        @RequestParam(defaultValue = "10") Integer pageSize,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Boolean status
    ) {
        Page<User> page = new Page<>(current, pageSize);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        
        // 添加搜索条件
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("nickname", keyword)
                    .or()
                    .like("phone", keyword);
        }
        
        if (status != null) {
            queryWrapper.eq("is_deleted", !status);
        }
        
        // 获取用户列表
        Page<User> userPage = userService.page(page, queryWrapper);
        
        // 获取用户头像
        List<User> users = userPage.getRecords();
        for (User user : users) {
            // 查询用户的所有头像
            QueryWrapper<UserAvatar> avatarWrapper = new QueryWrapper<>();
            avatarWrapper.eq("user_id", user.getId());
            avatarWrapper.orderByAsc("sort_order");
            List<UserAvatar> avatars = userAvatarService.list(avatarWrapper);
            
            // 将头像URL列表添加到用户对象
            List<String> carouselImgs = new ArrayList<>();
            for (UserAvatar avatar : avatars) {
                carouselImgs.add(avatar.getAvatarUrl());
            }
            user.setCarouselImgs(carouselImgs);
            
            // 设置默认头像
            if (!carouselImgs.isEmpty()) {
                user.setHandImg(carouselImgs.get(0));
            }
        }
        
        return Result.ok(userPage);
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
            userAvatarQueryWrapper.eq("user_id", user.getId()).orderByAsc("created_at").last("limit 1");
            UserAvatar one = userAvatarService.getOne(userAvatarQueryWrapper);
            user.setHandImg(one.getAvatarUrl());
        }

        return Result.ok(userList);

    }

    @GetMapping("findById")
    public Result findById(@RequestParam Integer id) {

        User one =   userAvatarService.findById(id);




        return Result.ok(one);
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
