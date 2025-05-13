package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.it.domain.Blacklist;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.UserPrivacy;
import com.it.domain.common.Result;
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
import java.util.stream.Collectors;

@RequestMapping("BlackList")
@RestController()
public class BlackListController {

    @Autowired
    private BlacklistService blacklistService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserAvatarService userAvatarService;
    
    @Autowired
    private TokenUtil tokenUtil;

    @RequestMapping("list")
    public Result list(@RequestBody Blacklist blacklist) {
        List<Blacklist> list = blacklistService.list();
        return Result.ok(list);
    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {
        Blacklist byId = blacklistService.getById(id);
        return Result.ok(byId);
    }

    @PostMapping("save")
    public Result save(@RequestBody Blacklist blacklist, HttpServletRequest request) {
        // 从Token获取当前用户ID
        String token = request.getHeader("token");
        Map<String, String> tokenMap = tokenUtil.parseToken(token);
        String currentUserId = tokenMap.get("userId");
        
        if (currentUserId == null) {
            return Result.fail("用户未登录");
        }
        
        // 设置当前用户ID为黑名单创建者
        blacklist.setUserId(Long.valueOf(currentUserId));
        
        // 检查是否已经拉黑
        LambdaQueryWrapper<Blacklist> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Blacklist::getUserId, blacklist.getUserId());
        queryWrapper.eq(Blacklist::getBlockedUserId, blacklist.getBlockedUserId());
        Blacklist existing = blacklistService.getOne(queryWrapper);
        
        if (existing != null) {
            return Result.ok(existing); // 已经拉黑，直接返回现有记录
        }
        
        // 设置创建时间
        blacklist.setCreatedAt(new java.util.Date());
        boolean saved = blacklistService.save(blacklist);
        
        if (saved) {
            return Result.ok(blacklist);
        } else {
            return Result.fail("添加黑名单失败");
        }
    }

    @PostMapping("update")
    public Result update(@RequestBody Blacklist blacklist) {
        boolean b = blacklistService.updateById(blacklist);
        Blacklist byId = blacklistService.getById(blacklist.getId());
        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = blacklistService.removeById(id);
        return Result.ok();
    }
    
    /**
     * 获取用户黑名单列表（带用户信息）
     */
    @GetMapping("getUserBlacklist")
    public Result getUserBlacklist(HttpServletRequest request) {
        // 从Token获取当前用户ID
        String token = request.getHeader("token");
        Map<String, String> tokenMap = tokenUtil.parseToken(token);
        String currentUserId = tokenMap.get("userId");
        
        if (currentUserId == null) {
            return Result.fail("用户未登录");
        }
        
        Long userId = Long.valueOf(currentUserId);
        
        try {
            // 查询该用户的所有黑名单记录
            LambdaQueryWrapper<Blacklist> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Blacklist::getUserId, userId);
            List<Blacklist> blacklists = blacklistService.list(queryWrapper);
            
            if (blacklists.isEmpty()) {
                return Result.ok(new ArrayList<>());
            }
            
            // 获取所有被拉黑用户的ID
            List<Long> blackUserIds = blacklists.stream()
                    .map(Blacklist::getBlockedUserId)
                    .collect(Collectors.toList());
            
            // 查询这些用户的信息
            List<User> blackUsers = userService.listByIds(blackUserIds);
            
            // 组装返回结果
            List<Map<String, Object>> resultList = new ArrayList<>();
            for (Blacklist blacklist : blacklists) {
                Map<String, Object> item = new HashMap<>();
                item.put("blacklist", blacklist);
                
                // 查找对应的用户
                User user = blackUsers.stream()
                        .filter(u -> u.getId().equals(blacklist.getBlockedUserId().intValue()))
                        .findFirst()
                        .orElse(null);
                
                if (user != null) {
                    // 获取用户头像
                    // 方法1：使用UserAvatarService的findById方法
                    try {
                        LambdaQueryWrapper<UserAvatar> avatarQuery = new LambdaQueryWrapper<>();
                        avatarQuery.eq(UserAvatar::getUserId, user.getId())
                                 .orderByAsc(UserAvatar::getCreatedAt)
                                 .last("limit 1");
                        UserAvatar avatar = userAvatarService.getOne(avatarQuery);
                        
                        if (avatar != null) {
                            user.setHandImg(avatar.getAvatarUrl());
                        } else {
                            user.setHandImg("/static/images/default-avatar.png");
                        }
                        
                        // 将avatar字段添加到返回结果中，以兼容前端
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("nickname", user.getNickname());
                        userMap.put("avatar", user.getHandImg());
                        
                        item.put("user", userMap);
                    } catch (Exception e) {
                        e.printStackTrace();
                        // 设置默认头像
                        user.setHandImg("/static/images/default-avatar.png");
                        
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("nickname", user.getNickname());
                        userMap.put("avatar", user.getHandImg());
                        
                        item.put("user", userMap);
                    }
                }
                
                resultList.add(item);
            }
            
            return Result.ok(resultList);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail("获取黑名单列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 检查用户是否在黑名单中
     */
    @GetMapping("checkInBlacklist")
    public Result checkInBlacklist(@RequestParam("targetUserId") Integer targetUserId, HttpServletRequest request) {
        // 从Token获取当前用户ID
        String token = request.getHeader("token");
        Map<String, String> tokenMap = tokenUtil.parseToken(token);
        String currentUserId = tokenMap.get("userId");
        
        if (currentUserId == null || targetUserId == null) {
            return Result.fail("用户ID不能为空");
        }
        
        Integer userId = Integer.valueOf(currentUserId);
        
        try {
            // 检查targetUserId是否将userId拉黑
            LambdaQueryWrapper<Blacklist> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Blacklist::getUserId, targetUserId);
            queryWrapper.eq(Blacklist::getBlockedUserId, userId);
            Blacklist blacklist = blacklistService.getOne(queryWrapper);
            
            // 检查userId是否将targetUserId拉黑
            LambdaQueryWrapper<Blacklist> queryWrapper2 = new LambdaQueryWrapper<>();
            queryWrapper2.eq(Blacklist::getUserId, userId);
            queryWrapper2.eq(Blacklist::getBlockedUserId, targetUserId);
            Blacklist blacklist2 = blacklistService.getOne(queryWrapper2);
            
            Map<String, Object> result = new HashMap<>();
            result.put("isInTargetBlacklist", blacklist != null);
            result.put("isInUserBlacklist", blacklist2 != null);
            
            return Result.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail("检查黑名单失败: " + e.getMessage());
        }
    }
    
    /**
     * 从黑名单中移除
     */
    @PostMapping("removeFromBlacklist")
    public Result removeFromBlacklist(@RequestParam("blockedUserId") Integer blockedUserId, HttpServletRequest request) {
        // 从Token获取当前用户ID
        String token = request.getHeader("token");
        Map<String, String> tokenMap = tokenUtil.parseToken(token);
        String currentUserId = tokenMap.get("userId");
        
        if (currentUserId == null || blockedUserId == null) {
            return Result.fail("用户ID不能为空");
        }
        
        Integer userId = Integer.valueOf(currentUserId);
        
        try {
            // 查询黑名单记录
            LambdaQueryWrapper<Blacklist> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Blacklist::getUserId, userId);
            queryWrapper.eq(Blacklist::getBlockedUserId, blockedUserId);
            Blacklist blacklist = blacklistService.getOne(queryWrapper);
            
            if (blacklist == null) {
                return Result.fail("该用户不在黑名单中");
            }
            
            // 删除黑名单记录
            boolean removed = blacklistService.removeById(blacklist.getId());
            
            if (removed) {
                return Result.ok();
            } else {
                return Result.fail("从黑名单中移除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail("从黑名单中移除失败: " + e.getMessage());
        }
    }
}
