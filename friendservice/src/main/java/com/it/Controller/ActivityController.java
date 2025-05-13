package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.*;
import com.it.domain.Blacklist;
import com.it.domain.DTO.ActivitySignupAndUser;
import com.it.domain.DTO.UserDTO;
import com.it.domain.common.Result;
import com.it.domain.common.ResultCodeEnum;
import com.it.service.ActivityService;
import com.it.service.ActivitySignupService;
import com.it.service.BlacklistService;
import com.it.service.UserAvatarService;
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

    @Autowired
    private UserAvatarService userAvatarService;
    
    @Autowired
    private BlacklistService blacklistService;

    @RequestMapping("list/{current}/{size}")
    public Result list(@PathVariable("size") Integer size, @PathVariable("current") Integer current, @RequestBody Activity activity, HttpServletRequest request) {
        // 获取当前用户ID
        String token = request.getHeader("token");
        Integer currentUserId = null;
        
        if (token != null && !token.isEmpty()) {
            Map<String, String> tokenMap = tokenUtil.parseToken(token);
            String userIdStr = tokenMap.get("userId");
            if (userIdStr != null && !userIdStr.isEmpty()) {
                currentUserId = Integer.parseInt(userIdStr);
            }
        }
        
        Page<Activity> objectPage = new Page<>(current, size);
        QueryWrapper<Activity> userAvatarQueryWrapper = new QueryWrapper<>();
        if (activity.getActivityType() != null && !activity.getActivityType().equals("")) {
            userAvatarQueryWrapper.eq("activity_type", activity.getActivityType());
        }

        if (activity.getTotalNumber() != null && activity.getTotalNumber() != 0) {
            userAvatarQueryWrapper.eq("total_number", activity.getTotalNumber());
        }


        if (activity.getMaxNumber() != null && activity.getMaxNumber() != 0 && activity.getMinCost() != null && activity.getMinCost() != 0) {
            userAvatarQueryWrapper.gt("total_number", activity.getMinNumber());
            userAvatarQueryWrapper.lt("total_number", activity.getMaxNumber());
        }



        if (activity.getCost() != null && activity.getMaxCost() != 0 && activity.getMinCost() != 0 && activity.getMinCost() != null) {
            userAvatarQueryWrapper.gt("cost", activity.getMinCost());
            userAvatarQueryWrapper.lt("cost", activity.getMaxCost());
        }

        // 记录活动列表查询参数和结果
        System.out.println("活动查询参数: " + activity);
        
        Page<Activity> page = activityService.page(objectPage, userAvatarQueryWrapper);
        System.out.println("查询到的活动数量: " + page.getRecords().size());
        
        ArrayList<Integer> objects = new ArrayList<>();
        for (Activity activityRecord : page.getRecords()) {
            Integer id = activityRecord.getUserId();
            objects.add(id);
            System.out.println("活动ID: " + activityRecord.getId() + ", 发布者ID: " + id);
        }
        
        List<UserDTO> users = userService.joinUserAvatar(objects);
        System.out.println("查询到的用户数量: " + users.size());
        
        // 处理所有用户，确保avatarUrl不为空，设置默认头像
        for (UserDTO user : users) {
            if (user.getAvatarUrl() == null || user.getAvatarUrl().isEmpty()) {
                System.out.println("用户 " + user.getId() + " 的头像URL为空，设置默认头像");
                // 设置默认头像URL
                user.setAvatarUrl("/static/images/default-avatar.png");
                
                // 尝试从UserAvatar表获取最新的头像
                try {
                    List<String> avatarList = userAvatarService.getAvatarList(user.getId(), 1);
                    if (avatarList != null && !avatarList.isEmpty()) {
                        String latestAvatar = avatarList.get(0);
                        if (latestAvatar != null && !latestAvatar.isEmpty()) {
                            user.setAvatarUrl(latestAvatar);
                            System.out.println("为用户 " + user.getId() + " 找到头像: " + latestAvatar);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("获取用户 " + user.getId() + " 的头像失败: " + e.getMessage());
                }
            }
        }
        
        // 如果没有找到用户，获取这些用户的基本信息
        if (users.size() < objects.size()) {
            System.out.println("警告: 部分用户信息缺失，尝试获取基本用户信息");
            List<UserDTO> basicUsers = new ArrayList<>();
            for (Integer userId : objects) {
                // 检查是否已经存在这个用户
                boolean userExists = false;
                for (UserDTO user : users) {
                    if (user.getId().equals(userId)) {
                        userExists = true;
                        break;
                    }
                }
                
                // 如果不存在，获取基本信息
                if (!userExists) {
                    User user = userService.getById(userId);
                    if (user != null) {
                        UserDTO basicUserDTO = new UserDTO();
                        basicUserDTO.setId(user.getId());
                        basicUserDTO.setNickname(user.getNickname() != null ? user.getNickname() : "用户" + user.getId());
                        basicUserDTO.setPhone(user.getPhone());
                        
                        // 设置默认头像
                        basicUserDTO.setAvatarUrl("/static/images/default-avatar.png");
                        
                        // 尝试获取用户头像
                        try {
                            List<String> avatarList = userAvatarService.getAvatarList(user.getId(), 1);
                            if (avatarList != null && !avatarList.isEmpty() && avatarList.get(0) != null) {
                                basicUserDTO.setAvatarUrl(avatarList.get(0));
                                System.out.println("为新增用户 " + user.getId() + " 设置头像: " + avatarList.get(0));
                            }
                        } catch (Exception e) {
                            System.err.println("获取新增用户 " + user.getId() + " 的头像失败: " + e.getMessage());
                        }
                        
                        basicUsers.add(basicUserDTO);
                        System.out.println("添加基本用户信息: " + basicUserDTO + ", 头像URL: " + basicUserDTO.getAvatarUrl());
                    }
                }
            }
            
            // 将基本用户信息合并到users列表
            users.addAll(basicUsers);
        }
        
        HashMap<Integer, UserDTO> hashMap = new HashMap<>();
        for (UserDTO user : users) {
            hashMap.put(user.getId(), user);
            System.out.println("用户映射: " + user.getId() + " -> " + user.getNickname() + ", 头像URL: " + user.getAvatarUrl());
        }
        
        ArrayList<ActivitySignupAndUser> activitySignupAndUsers = new ArrayList<>();
        
        // 获取当前用户的黑名单列表
        List<Integer> blacklistedUserIds = new ArrayList<>();
        if (currentUserId != null) {
            try {
                // 查询黑名单表
                blacklistedUserIds = getBlacklistedUserIds(currentUserId);
                System.out.println("用户 " + currentUserId + " 的黑名单列表: " + blacklistedUserIds);
            } catch (Exception e) {
                System.err.println("获取黑名单失败: " + e.getMessage());
            }
        }

        for (Activity activityRecord : page.getRecords()) {
            // 如果活动发布者在黑名单中，则跳过该活动
            if (blacklistedUserIds.contains(activityRecord.getUserId())) {
                System.out.println("跳过黑名单用户 " + activityRecord.getUserId() + " 发布的活动: " + activityRecord.getId());
                continue;
            }
            
            UserDTO userDTO = hashMap.get(activityRecord.getUserId());
            if (userDTO != null) {
                ActivitySignupAndUser activitySignupAndUser = new ActivitySignupAndUser(activityRecord, userDTO);
                activitySignupAndUsers.add(activitySignupAndUser);
                System.out.println("添加活动与用户: 活动ID=" + activityRecord.getId() + ", 用户ID=" + userDTO.getId() + ", 头像URL=" + userDTO.getAvatarUrl());
            } else {
                // 为空的用户创建一个基础UserDTO
                UserDTO defaultUserDTO = new UserDTO();
                defaultUserDTO.setId(activityRecord.getUserId());
                defaultUserDTO.setNickname("未知用户");
                // 设置默认头像
                defaultUserDTO.setAvatarUrl("/static/images/default-avatar.png");
                
                ActivitySignupAndUser activitySignupAndUser = new ActivitySignupAndUser(activityRecord, defaultUserDTO);
                activitySignupAndUsers.add(activitySignupAndUser);
                System.out.println("添加活动与默认用户: 活动ID=" + activityRecord.getId() + ", 用户ID=" + activityRecord.getUserId() + ", 头像URL=" + defaultUserDTO.getAvatarUrl());
            }
        }

        return Result.ok(activitySignupAndUsers);
    }
    
    /**
     * 获取用户的黑名单列表
     * @param userId 用户ID
     * @return 黑名单用户ID列表
     */
    private List<Integer> getBlacklistedUserIds(Integer userId) {
        List<Integer> blacklistedUserIds = new ArrayList<>();
        try {
            // 查询数据库获取黑名单列表
            QueryWrapper<Blacklist> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId);
            List<Blacklist> blacklists = blacklistService.list(queryWrapper);
            
            // 提取被拉黑用户的ID
            for (Blacklist blacklist : blacklists) {
                // 将Long类型转换为Integer
                blacklistedUserIds.add(blacklist.getBlockedUserId().intValue());
            }
        } catch (Exception e) {
            System.err.println("获取黑名单列表失败: " + e.getMessage());
        }
        return blacklistedUserIds;
    }

    /**
     * 我发布过的活动（无参）
     *
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
        } else {
            return Result.fail(ResultCodeEnum.LOGIN_AUTH);
        }


        List<Activity> list = activityService.list(userAvatarQueryWrapper);
        ArrayList<Integer> objects = new ArrayList<>();
        for (Activity activitySignups : list) {
            Integer id = activitySignups.getUserId();
            objects.add(id);

        }
        List<UserDTO> users = userService.joinUserAvatar(objects);
        HashMap<Integer, UserDTO> hashMap = new HashMap<>();

        for (UserDTO user : users) {
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
        // 创建返回结果的Map
        HashMap<String, Object> resultMap = new HashMap<>();
        
        // 1. 获取活动详情
        Activity activity = activityService.getById(id);
        if (activity == null) {
            return Result.fail("活动不存在");
        }
        resultMap.put("activity", activity);
        
        // 2. 获取活动创建者信息
        try {
            User activityCreator = userService.getById(activity.getUserId());
            if (activityCreator != null) {
                UserDTO creatorDTO = new UserDTO();
                creatorDTO.setId(activityCreator.getId());
                creatorDTO.setNickname(activityCreator.getNickname());
                
                // 获取创建者头像
                List<String> creatorAvatars = userAvatarService.getAvatarList(activityCreator.getId(), 1);
                if (creatorAvatars != null && !creatorAvatars.isEmpty()) {
                    creatorDTO.setAvatarUrl(creatorAvatars.get(0));
                } else {
                    creatorDTO.setAvatarUrl("/static/images/default-avatar.png");
                }
                
                resultMap.put("creator", creatorDTO);
            }
        } catch (Exception e) {
            System.out.println("获取活动创建者信息失败: " + e.getMessage());
        }
        
        // 3. 获取活动报名用户信息
        List<ActivitySignup> signupList = null;
        try {
            // 按报名时间降序排序
            QueryWrapper<ActivitySignup> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("activity_id", activity.getId())
                       .orderByDesc("created_at");
            
            signupList = activitySignupService.list(queryWrapper);
            System.out.println("活动ID " + id + " 的报名人数: " + (signupList != null ? signupList.size() : 0));
            
            if (signupList == null || signupList.isEmpty()) {
                resultMap.put("participants", new ArrayList<>());
                return Result.ok(resultMap);
            }
        } catch (Exception e) {
            System.out.println("获取活动报名列表失败: " + e.getMessage());
            e.printStackTrace();
            resultMap.put("participants", new ArrayList<>());
            return Result.ok(resultMap);
        }
        
        // 4. 获取所有报名用户的ID
        ArrayList<Integer> userIds = new ArrayList<>();
        for (ActivitySignup signup : signupList) {
            userIds.add(signup.getUserId());
        }
        
        // 5. 批量获取用户详细信息（包含头像）
        List<UserDTO> usersList = userService.joinUserAvatar(userIds);
        
        // 创建用户ID到用户信息的映射，方便查找
        HashMap<Integer, UserDTO> userMap = new HashMap<>();
        for (UserDTO user : usersList) {
            userMap.put(user.getId(), user);
        }
        
        // 6. 组装报名用户信息列表
        ArrayList<ActivitySignupAndUser> participantsList = new ArrayList<>();
        for (ActivitySignup signup : signupList) {
            Integer userId = signup.getUserId();
            UserDTO userDTO = userMap.get(userId);
            
            if (userDTO == null) {
                // 如果在映射中找不到用户，尝试单独获取
                User user = userService.getById(userId);
                if (user != null) {
                    userDTO = new UserDTO();
                    userDTO.setId(user.getId());
                    userDTO.setNickname(user.getNickname() != null ? user.getNickname() : "用户" + user.getId());
                    
                    // 获取用户头像
                    try {
                        List<String> avatars = userAvatarService.getAvatarList(user.getId(), 1);
                        if (avatars != null && !avatars.isEmpty()) {
                            userDTO.setAvatarUrl(avatars.get(0));
                        } else {
                            userDTO.setAvatarUrl("/static/images/default-avatar.png");
                        }
                    } catch (Exception e) {
                        userDTO.setAvatarUrl("/static/images/default-avatar.png");
                        System.out.println("获取用户 " + user.getId() + " 的头像失败: " + e.getMessage());
                    }
                } else {
                    // 用户不存在，创建一个默认用户DTO
                    userDTO = new UserDTO();
                    userDTO.setId(userId);
                    userDTO.setNickname("未知用户");
                    userDTO.setAvatarUrl("/static/images/default-avatar.png");
                }
            }
            
            // 确保用户头像不为空
            if (userDTO.getAvatarUrl() == null || userDTO.getAvatarUrl().isEmpty()) {
                userDTO.setAvatarUrl("/static/images/default-avatar.png");
            }
            
            // 创建并添加ActivitySignupAndUser对象
            ActivitySignupAndUser signupAndUser = new ActivitySignupAndUser(signup, userDTO);
            participantsList.add(signupAndUser);
        }
        
        // 7. 将参与者列表添加到结果中
        resultMap.put("participants", participantsList);
        
        // 8. 返回结果
        return Result.ok(resultMap);
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
