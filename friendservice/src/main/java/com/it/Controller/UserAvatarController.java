package com.it.Controller;

import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.UserAvatarService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("UserAvatar")
@RestController
public class UserAvatarController {


    @Autowired
    private UserAvatarService userAvatarService;

    @Autowired
    private UserService userService;

    @RequestMapping("list")
    public Result list(@RequestBody User user) {

        List<UserAvatar> list = userAvatarService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        UserAvatar byId = userAvatarService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("update")
    public Result update(@RequestBody UserAvatar user) {

        boolean b = userAvatarService.updateById(user);
        UserAvatar byId = userAvatarService.getById(user.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = userAvatarService.removeById(id);
        return Result.ok();
    }


}
