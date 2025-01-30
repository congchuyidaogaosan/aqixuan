package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Activity;
import com.it.domain.MomentLike;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.ActivityService;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("Activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;
    @Autowired
    private TokenUtil tokenUtil;

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
    public Result save(@RequestBody Activity activity, HttpServletRequest request) {
        //更新
        String token = request.getHeader("token");

        Map<String, String> stringStringMap = tokenUtil.parseToken(token);

        String userId = stringStringMap.get("userId");
        activity.setUserId(Integer.parseInt(userId));
        boolean b = activityService.save(activity);
        Activity byId = activityService.getById(activity.getId());

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
