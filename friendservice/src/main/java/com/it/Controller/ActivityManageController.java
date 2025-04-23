package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.Activity;
import com.it.domain.ActivitySignup;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.domain.common.ResultCodeEnum;
import com.it.service.ActivityService;
import com.it.service.ActivitySignupService;
import com.it.service.UserService;
import com.it.service.UserAvatarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/manage/activity")
public class ActivityManageController {
    private static final Logger logger = LoggerFactory.getLogger(ActivityManageController.class);

    @Autowired
    private ActivityService activityService;

    @Autowired
    private ActivitySignupService activitySignupService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserAvatarService userAvatarService;

    // 获取用户头像的辅助方法
    private String getUserAvatar(Integer userId) {
        LambdaQueryWrapper<UserAvatar> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserAvatar::getUserId, userId)
               .orderByAsc(UserAvatar::getSortOrder)
               .last("LIMIT 1");
        UserAvatar avatar = userAvatarService.getOne(wrapper);
        return avatar != null ? avatar.getAvatarUrl() : "";
    }

    @GetMapping("/list")
    public Result<Map<String, Object>> getActivityList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String activityType,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime,
            @RequestParam(required = false) Byte status
    ) {
        try {
            // 1. 构建查询条件
            LambdaQueryWrapper<Activity> wrapper = new LambdaQueryWrapper<>();
            if (keyword != null && !keyword.trim().isEmpty()) {
                wrapper.like(Activity::getTitle, keyword)
                      .or()
                      .like(Activity::getDescription, keyword);
            }
            if (activityType != null && !activityType.trim().isEmpty()) {
                wrapper.eq(Activity::getActivityType, activityType);
            }
            if (startTime != null && endTime != null) {
                wrapper.between(Activity::getStartTime, startTime, endTime);
            }
            if (status != null) {
                wrapper.eq(Activity::getStatus, status);
            }
            wrapper.orderByDesc(Activity::getCreatedAt);

            // 2. 分页查询
            Page<Activity> page = new Page<>(pageNum, pageSize);
            Page<Activity> activityPage = activityService.page(page, wrapper);

            // 3. 获取用户信息
            List<Activity> records = activityPage.getRecords();
            if (!records.isEmpty()) {
                Set<Integer> userIds = records.stream()
                        .map(Activity::getUserId)
                        .collect(Collectors.toSet());

                Map<Integer, User> userMap = userService.listByIds(userIds)
                        .stream()
                        .collect(Collectors.toMap(User::getId, user -> user));

                // 4. 组装返回数据
                List<Map<String, Object>> resultList = records.stream().map(activity -> {
                    Map<String, Object> resultMap = new HashMap<>();
                    resultMap.put("activity", activity);
                    
                    User user = userMap.get(activity.getUserId());
                    if (user != null) {
                        resultMap.put("creatorNickname", user.getNickname());
                        resultMap.put("creatorAvatar", user.getHandImg());
                    }
                    
                    return resultMap;
                }).collect(Collectors.toList());

                Map<String, Object> result = new HashMap<>();
                result.put("records", resultList);
                result.put("total", activityPage.getTotal());
                result.put("size", activityPage.getSize());
                result.put("current", activityPage.getCurrent());
                return Result.<Map<String, Object>>build(result, ResultCodeEnum.SUCCESS);
            }

            Map<String, Object> emptyResult = new HashMap<>();
            emptyResult.put("records", new ArrayList<>());
            emptyResult.put("total", activityPage.getTotal());
            emptyResult.put("size", activityPage.getSize());
            emptyResult.put("current", activityPage.getCurrent());
            return Result.<Map<String, Object>>build(emptyResult, ResultCodeEnum.SUCCESS);

        } catch (Exception e) {
            e.printStackTrace();
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取活动列表失败");
        }
    }

    @PostMapping("/delete/{id}")
    public Result<Void> deleteActivity(@PathVariable Integer id) {
        try {
            // 1. 删除活动
            boolean removed = activityService.removeById(id);
            if (!removed) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("活动不存在");
            }

            // 2. 删除相关报名记录
            activitySignupService.remove(new LambdaQueryWrapper<ActivitySignup>()
                    .eq(ActivitySignup::getActivityId, id));

            return Result.<Void>build(null, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.<Void>build(null, ResultCodeEnum.FAIL).message("删除活动失败");
        }
    }

    @PostMapping("/batchDelete")
    public Result<Void> batchDeleteActivities(@RequestBody List<Integer> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("请选择要删除的活动");
            }

            // 1. 批量删除活动
            boolean removed = activityService.removeByIds(ids);
            if (!removed) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("删除失败");
            }

            // 2. 批量删除相关报名记录
            activitySignupService.remove(new LambdaQueryWrapper<ActivitySignup>()
                    .in(ActivitySignup::getActivityId, ids));

            return Result.<Void>build(null, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.<Void>build(null, ResultCodeEnum.FAIL).message("批量删除活动失败");
        }
    }

    @GetMapping("/detail/{id}")
    public Result<Map<String, Object>> getActivityDetail(@PathVariable Integer id) {
        try {
            Activity activity = activityService.getById(id);
            if (activity == null) {
                return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("活动不存在");
            }

            User creator = userService.getById(activity.getUserId());
            
            // 获取创建者头像
            String creatorAvatar = getUserAvatar(activity.getUserId());
            logger.info("Creator avatar URL: {}", creatorAvatar);

            // 获取报名人数信息
            LambdaQueryWrapper<ActivitySignup> signupWrapper = new LambdaQueryWrapper<>();
            signupWrapper.eq(ActivitySignup::getActivityId, id)
                      .eq(ActivitySignup::getStatus, 1); // 只统计状态为1（已参与）的报名人数
            long signupCount = activitySignupService.count(signupWrapper);

            Map<String, Object> result = new HashMap<>();
            Map<String, Object> activityMap = new HashMap<>();
            activityMap.put("id", activity.getId());
            activityMap.put("title", activity.getTitle());
            activityMap.put("handImg", activity.getHandImg());
            activityMap.put("description", activity.getDescription());
            activityMap.put("notice", activity.getDescription()); // 使用description作为notice内容
            activityMap.put("location", activity.getLocation());
            activityMap.put("activityType", activity.getActivityType());
            activityMap.put("totalNumber", activity.getTotalNumber());
            activityMap.put("status", activity.getStatus());
            activityMap.put("startTime", activity.getStartTime());
            activityMap.put("endTime", activity.getEndTime());
            activityMap.put("createdAt", activity.getCreatedAt());
            
            result.put("activity", activityMap);
            
            if (creator != null) {
                Map<String, Object> creatorInfo = new HashMap<>();
                creatorInfo.put("id", creator.getId());
                creatorInfo.put("nickname", creator.getNickname());
                creatorInfo.put("avatar", creatorAvatar);
                result.put("creator", creatorInfo);
            }
            result.put("signupCount", signupCount);

            return Result.<Map<String, Object>>build(result, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("获取活动详情失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取活动详情失败");
        }
    }

    @GetMapping("/participants/{activityId}")
    public Result<Map<String, Object>> getActivityParticipants(
            @PathVariable Integer activityId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        try {
            Page<ActivitySignup> page = new Page<>(pageNum, pageSize);
            LambdaQueryWrapper<ActivitySignup> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(ActivitySignup::getActivityId, activityId)
                  .orderByDesc(ActivitySignup::getCreatedAt);

            Page<ActivitySignup> signupPage = activitySignupService.page(page, wrapper);

            Set<Integer> userIds = signupPage.getRecords().stream()
                    .map(ActivitySignup::getUserId)
                    .collect(Collectors.toSet());

            // 获取用户基本信息
            Map<Integer, User> userMap = userService.listByIds(userIds)
                    .stream()
                    .collect(Collectors.toMap(User::getId, user -> user));

            // 获取用户头像信息
            Map<Integer, String> avatarMap = new HashMap<>();
            for (Integer userId : userIds) {
                avatarMap.put(userId, getUserAvatar(userId));
            }

            List<Map<String, Object>> participants = signupPage.getRecords().stream()
                    .map(signup -> {
                        Map<String, Object> participantInfo = new HashMap<>();
                        User user = userMap.get(signup.getUserId());
                        if (user != null) {
                            participantInfo.put("id", signup.getId());
                            participantInfo.put("userId", user.getId());
                            participantInfo.put("nickname", user.getNickname());
                            participantInfo.put("avatar", avatarMap.get(user.getId()));
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                            participantInfo.put("joinTime", sdf.format(signup.getCreatedAt()));
                            participantInfo.put("status", signup.getStatus());
                        }
                        return participantInfo;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("records", participants);
            result.put("total", signupPage.getTotal());
            result.put("size", signupPage.getSize());
            result.put("current", signupPage.getCurrent());

            return Result.<Map<String, Object>>build(result, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("获取参与者列表失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取参与者列表失败");
        }
    }
} 