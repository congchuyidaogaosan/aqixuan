package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.*;
import com.it.domain.DTO.ActivitySignupAndUser;
import com.it.domain.common.Result;
import com.it.domain.common.ResultCodeEnum;
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
@RequestMapping("Activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;
    @Autowired
    private TokenUtil tokenUtil;

    @Autowired
    private ActivitySignupService activitySignupService;

    @Autowired
    private UserService userService;

    @RequestMapping("list/{current}/{size}")
    public Result list(@PathVariable("size") Integer size, @PathVariable("current") Integer current, Activity activity) {
        Page<Activity> objectPage = new Page<>(current, size);
        QueryWrapper<Activity> userAvatarQueryWrapper = new QueryWrapper<>();
        if (activity.getActivityType() != null && !activity.getActivityType().equals("")) {
            userAvatarQueryWrapper.eq("activity_type", activity.getActivityType());
        }

        if (activity.getTotalNumber() != null && activity.getTotalNumber() != 0) {
            userAvatarQueryWrapper.eq("total_number", activity.getTotalNumber());
        }

        Page<Activity> page = activityService.page(objectPage, userAvatarQueryWrapper);
        ArrayList<Integer> objects = new ArrayList<>();
        for (Activity activitySignups : page.getRecords()) {
            Integer id = activitySignups.getUserId();
            objects.add(id);

        }
        List<User> users = userService.joinUserAvatar(objects);
        HashMap<Integer, User> hashMap = new HashMap<>();

        for (User user : users) {
            hashMap.put(user.getId(), user);
        }
        ArrayList<ActivitySignupAndUser> activitySignupAndUsers = new ArrayList<>();

        for (Activity activitySignup1 : page.getRecords()) {
            if (hashMap.containsKey(activitySignup1.getUserId())) {
                ActivitySignupAndUser activitySignupAndUser = new ActivitySignupAndUser(activitySignup1, hashMap.get(activitySignup1.getUserId()));
                activitySignupAndUsers.add(activitySignupAndUser);
            }
        }

        return Result.ok(activitySignupAndUsers);
    }

    /**
     * 我发布过的活动（无参）
     * @param request
     * @return
     */
    @GetMapping("PublishTheEvent")
    public Result PublishTheEvent(HttpServletRequest request) {

        String token = request.getHeader("token");

        Map<String, String> stringStringMap = tokenUtil.parseToken(token);

        String userId = stringStringMap.get("userId");
        QueryWrapper<Activity> userAvatarQueryWrapper = new QueryWrapper<>();

        if (userId != null && !userId.equals("")) {
            userAvatarQueryWrapper.eq("user_id", userId);
        }else {
            return Result.fail(ResultCodeEnum.LOGIN_AUTH);
        }



        List<Activity> list = activityService.list(userAvatarQueryWrapper);
        ArrayList<Integer> objects = new ArrayList<>();
        for (Activity activitySignups : list) {
            Integer id = activitySignups.getUserId();
            objects.add(id);

        }
        List<User> users = userService.joinUserAvatar(objects);
        HashMap<Integer, User> hashMap = new HashMap<>();

        for (User user : users) {
            hashMap.put(user.getId(), user);
        }
        ArrayList<ActivitySignupAndUser> activitySignupAndUsers = new ArrayList<>();

        for (Activity activitySignup1 : list) {
            if (hashMap.containsKey(activitySignup1.getUserId())) {
                ActivitySignupAndUser activitySignupAndUser = new ActivitySignupAndUser(activitySignup1, hashMap.get(activitySignup1.getUserId()));
                activitySignupAndUsers.add(activitySignupAndUser);
            }
        }
        return Result.ok(activitySignupAndUsers);
    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        Activity byId = activityService.getById(id);

        List<ActivitySignup> activity_id = activitySignupService.list(new QueryWrapper<ActivitySignup>().eq("activity_id", byId.getId()));

        ArrayList<Integer> objects = new ArrayList<>();

        for (ActivitySignup activitySignup : activity_id) {
            Integer activitySignupUserId = activitySignup.getUserId();
            objects.add(activitySignupUserId);

        }
        List<User> users = userService.joinUserAvatar(objects);
        HashMap<Integer, User> hashMap = new HashMap<>();

        for (User user : users) {
            hashMap.put(user.getId(), user);
        }
        ArrayList<ActivitySignupAndUser> activitySignupAndUsers = new ArrayList<>();

        for (ActivitySignup activitySignup1 : activity_id) {
            if (hashMap.containsKey(activitySignup1.getUserId())) {
                ActivitySignupAndUser activitySignupAndUser = new ActivitySignupAndUser(activitySignup1, hashMap.get(activitySignup1.getUserId()));
                activitySignupAndUsers.add(activitySignupAndUser);
            }
        }

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
