package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.Activity;
import com.it.domain.ActivitySignup;
import com.it.domain.DTO.ActivitySignupAndUser;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.ActivityService;
import com.it.service.ActivitySignupService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("ActivitySignup")
public class ActivitySignupController {


    @Autowired
    private ActivitySignupService activitySignupService;

    @Autowired
    private UserService userService;


    @PostMapping("list")
    public Result list(){
        List<ActivitySignup> list = activitySignupService.list();
        return Result.ok(list);
    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        ActivitySignup byId = activitySignupService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody ActivitySignup activitySignup) {

        boolean b = activitySignupService.save(activitySignup);
        ActivitySignup byId = activitySignupService.getById(activitySignup.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody ActivitySignup activitySignup) {

        boolean b = activitySignupService.updateById(activitySignup);
        ActivitySignup byId = activitySignupService.getById(activitySignup.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = activitySignupService.removeById(id);
        return Result.ok();
    }

}
