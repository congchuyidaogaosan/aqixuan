package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.UserAvatarService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/manage/user")
public class UserManageController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserAvatarService userAvatarService;

    @GetMapping("list")
    public Result list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean status
    ) {
        Page<User> page = new Page<>(current, pageSize);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        
        // 添加搜索条件
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("nickname", keyword)
                    .or()
                    .like("phone", keyword);
        }
        
        if (status != null) {
            queryWrapper.eq("is_deleted", !status);
        }
        
        // 获取用户列表
        Page<User> userPage = userService.page(page, queryWrapper);
        
        // 获取用户头像
        List<User> users = userPage.getRecords();
        for (User user : users) {
            // 查询用户的所有头像
            QueryWrapper<UserAvatar> avatarWrapper = new QueryWrapper<>();
            avatarWrapper.eq("user_id", user.getId());
            avatarWrapper.orderByAsc("sort_order");
            List<UserAvatar> avatars = userAvatarService.list(avatarWrapper);
            
            // 将头像URL列表添加到用户对象
            List<String> carouselImgs = new ArrayList<>();
            for (UserAvatar avatar : avatars) {
                carouselImgs.add(avatar.getAvatarUrl());
            }
            user.setCarouselImgs(carouselImgs);
            
            // 设置默认头像
            if (!carouselImgs.isEmpty()) {
                user.setHandImg(carouselImgs.get(0));
            }
        }
        
        return Result.ok(userPage);
    }

    @PostMapping("create")
    public Result create(@RequestBody User user) {
        // 设置默认值
        user.setIsVerified(false);
        user.setIsDeleted(false);
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        
        boolean success = userService.save(user);
        if (success) {
            // 保存用户头像
            if (user.getCarouselImgs() != null && !user.getCarouselImgs().isEmpty()) {
                List<UserAvatar> avatars = new ArrayList<>();
                int sortOrder = 0;
                for (String avatarUrl : user.getCarouselImgs()) {
                    UserAvatar avatar = new UserAvatar();
                    avatar.setUserId(user.getId());
                    avatar.setAvatarUrl(avatarUrl);
                    avatar.setSortOrder(sortOrder++);
                    avatars.add(avatar);
                }
                userAvatarService.saveBatch(avatars);
            }
            return Result.ok(user);
        }
        return Result.fail("创建用户失败");
    }

    @PostMapping("update")
    public Result update(@RequestBody User user) {
        if (user.getId() == null) {
            return Result.fail("用户ID不能为空");
        }
        
        user.setUpdatedAt(new Date());
        boolean success = userService.updateById(user);
        
        if (success) {
            // 删除原有头像
            QueryWrapper<UserAvatar> deleteWrapper = new QueryWrapper<>();
            deleteWrapper.eq("user_id", user.getId());
            userAvatarService.remove(deleteWrapper);
            
            // 保存新的头像
            if (user.getCarouselImgs() != null && !user.getCarouselImgs().isEmpty()) {
                List<UserAvatar> avatars = new ArrayList<>();
                int sortOrder = 0;
                for (String avatarUrl : user.getCarouselImgs()) {
                    UserAvatar avatar = new UserAvatar();
                    avatar.setUserId(user.getId());
                    avatar.setAvatarUrl(avatarUrl);
                    avatar.setSortOrder(sortOrder++);
                    avatars.add(avatar);
                }
                userAvatarService.saveBatch(avatars);
            }
            
            // 更新后重新获取用户信息（包含头像）
            User updatedUser = userService.getById(user.getId());
            // 获取用户头像
            QueryWrapper<UserAvatar> avatarWrapper = new QueryWrapper<>();
            avatarWrapper.eq("user_id", user.getId());
            avatarWrapper.orderByAsc("sort_order");
            List<UserAvatar> avatars = userAvatarService.list(avatarWrapper);
            
            List<String> carouselImgs = new ArrayList<>();
            for (UserAvatar avatar : avatars) {
                carouselImgs.add(avatar.getAvatarUrl());
            }
            updatedUser.setCarouselImgs(carouselImgs);
            if (!carouselImgs.isEmpty()) {
                updatedUser.setHandImg(carouselImgs.get(0));
            }
            
            return Result.ok(updatedUser);
        }
        return Result.fail("更新用户失败");
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        // 检查用户是否存在
        User user = userService.getById(id);
        if (user == null) {
            return Result.fail("用户不存在");
        }
        
        // 删除用户头像
        QueryWrapper<UserAvatar> avatarWrapper = new QueryWrapper<>();
        avatarWrapper.eq("user_id", id);
        userAvatarService.remove(avatarWrapper);
        
        // 删除用户
        boolean success = userService.removeById(id);
        if (success) {
            return Result.ok();
        }
        return Result.fail("删除用户失败");
    }

    @PostMapping("batchDelete")
    public Result batchDelete(@RequestBody List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Result.fail("用户ID列表不能为空");
        }
        
        // 删除用户头像
        QueryWrapper<UserAvatar> avatarWrapper = new QueryWrapper<>();
        avatarWrapper.in("user_id", ids);
        userAvatarService.remove(avatarWrapper);
        
        // 删除用户
        boolean success = userService.removeByIds(ids);
        if (success) {
            return Result.ok();
        }
        return Result.fail("批量删除用户失败");
    }

    @GetMapping("detail/{id}")
    public Result detail(@PathVariable("id") Integer id) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.fail("用户不存在");
        }

        // 获取用户头像
        QueryWrapper<UserAvatar> avatarWrapper = new QueryWrapper<>();
        avatarWrapper.eq("user_id", id);
        avatarWrapper.orderByAsc("sort_order");
        List<UserAvatar> avatars = userAvatarService.list(avatarWrapper);
        
        List<String> carouselImgs = new ArrayList<>();
        for (UserAvatar avatar : avatars) {
            carouselImgs.add(avatar.getAvatarUrl());
        }
        user.setCarouselImgs(carouselImgs);
        if (!carouselImgs.isEmpty()) {
            user.setHandImg(carouselImgs.get(0));
        }

        return Result.ok(user);
    }
} 