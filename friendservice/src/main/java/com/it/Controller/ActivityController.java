package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Activity;
import com.it.domain.MomentLike;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("Activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;


    @RequestMapping("list")
    public Result list(@RequestBody UserAvatar user) {

        QueryWrapper<Activity> userAvatarQueryWrapper = new QueryWrapper<>();
        if (user.getUserId() != null && user.getUserId() != 0) {
            userAvatarQueryWrapper.eq("user_id", user.getUserId());
        }


        List<Activity> list = activityService.list(userAvatarQueryWrapper);
        return Result.ok(list);
    }


    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        Activity byId = activityService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody Activity momentLike) {

        boolean b = activityService.save(momentLike);
        Activity byId = activityService.getById(momentLike.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody Activity momentLike) {

        boolean b = activityService.updateById(momentLike);
        Activity byId = activityService.getById(momentLike.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = activityService.removeById(id);
        return Result.ok();
    }

}
