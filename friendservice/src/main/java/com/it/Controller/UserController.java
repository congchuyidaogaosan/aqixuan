package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("user")
@RestController
public class UserController {


    @Autowired
    private UserService userService;

    @RequestMapping("list")
    public Result list(@RequestBody User user) {

        List<User> list = userService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {
        User user = (User) session.getAttribute("info");
        if (user == null) {
            return Result.fail("请登入用户");
        }

        User byId = userService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("update")
    public Result update(@RequestBody User user) {

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
