package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.DTO.UserInfoDTO;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("UserAvatar")
@RestController
public class UserAvatarController {


    @Autowired
    private UserAvatarService userAvatarService;

    @Autowired
    private TokenUtil tokenUtil;

    @Autowired
    private UserService userService;

    @RequestMapping("list")
    public Result list(@RequestBody UserAvatar user) {

        QueryWrapper<UserAvatar> userAvatarQueryWrapper = new QueryWrapper<>();
        if (user.getUserId()!=null && user.getUserId()!=0 ){
            userAvatarQueryWrapper.eq("user_id",user.getUserId());
        }


        List<UserAvatar> list = userAvatarService.list(userAvatarQueryWrapper);
        return Result.ok(list);

    }

    // 获取自己的头像列表
    @GetMapping("myAvatarList")
    public Result list(HttpServletRequest request) {
        UserAvatar userAvatar = new UserAvatar();

        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");

        userAvatar.setUserId(Integer.valueOf(userId));

        QueryWrapper<UserAvatar> userAvatarQueryWrapper = new QueryWrapper<>();
        if (userAvatar.getUserId()!=null && userAvatar.getUserId()!=0 ){
            userAvatarQueryWrapper.eq("user_id",userAvatar.getUserId());
        }

        List<UserAvatar> list = userAvatarService.list(userAvatarQueryWrapper);
        return Result.ok(list);
    }


    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        UserAvatar byId = userAvatarService.getById(id);

        return Result.ok(byId);
    }

    @GetMapping("UserFind/{id}")
    public Result<UserInfoDTO> UserFind(@PathVariable("id") Integer id, HttpSession session) {

        User byId1 = userService.getById(id);
        UserAvatar byId = userAvatarService.getOne(new QueryWrapper<UserAvatar>().eq("user_id",id).orderByDesc("created_at").last("LIMIT 1"));
        UserInfoDTO userInfoDTO=new UserInfoDTO();
        userInfoDTO.setAvatar(byId);
        userInfoDTO.setUser(byId1);
        return Result.ok(userInfoDTO);
    }


    @PostMapping("update")
    public Result update(@RequestBody UserAvatar user) {

        boolean b = userAvatarService.updateById(user);
        UserAvatar byId = userAvatarService.getById(user.getId());

        return Result.ok(byId);
    }

    @PostMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = userAvatarService.removeById(id);
        return Result.ok();
    }

    @PostMapping("save")
    public Result save(@RequestBody UserAvatar userAvatar, HttpServletRequest request) {
        String token = request.getHeader("token");

        Map<String, String> stringStringMap = tokenUtil.parseToken(token);

        String userId = stringStringMap.get("userId");

        userAvatar.setUserId(Integer.valueOf(userId));
        boolean save = userAvatarService.save(userAvatar);
        return Result.ok();
    }

    // 根据用户ID查询头像
    @GetMapping("findAvatarByUserId")
    public Result findAvatarByUserId(@RequestParam("userId") Integer userId) {
        QueryWrapper<UserAvatar> userAvatarQueryWrapper = new QueryWrapper<>();
        userAvatarQueryWrapper.eq("user_id",userId).orderByDesc("created_at");
        List<UserAvatar> list = userAvatarService.list(userAvatarQueryWrapper);
        return Result.ok(list);
    }

}
