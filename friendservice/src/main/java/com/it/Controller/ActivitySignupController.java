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
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("ActivitySignup")
public class ActivitySignupController {


    @Autowired
    private ActivitySignupService activitySignupService;

    @Autowired
    private TokenUtil tokenUtil;


    @Autowired
    private ActivityService activityService;

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

    // 报名活动
    @PostMapping("signup")
    public Result signup(@RequestBody ActivitySignup activitySignup, HttpServletRequest request) {

        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");

        activitySignup.setUserId(Integer.parseInt(userId));
        activitySignup.setStatus("1");

        boolean b = activitySignupService.save(activitySignup);


        return Result.ok();
    }

    // 同意或拒绝
    @PostMapping("updateStatus")
    public Result updateStatus(@RequestBody ActivitySignup activitySignup) {
        boolean b = activitySignupService.updateById(activitySignup);
        if (activitySignup.getStatus().equals("2")) {
            Activity activity = activityService.getById(activitySignup.getActivityId());
            activity.setCurrentNumber(activity.getCurrentNumber() + 1);
            activityService.updateById(activity);
        }

        return Result.ok();
    }
}
