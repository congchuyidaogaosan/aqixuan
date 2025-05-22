package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.DTO.FollowAllDTO;
import com.it.domain.Follow;
import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.domain.query.FollowQuery;
import com.it.service.FollowService;
import com.it.service.UserService;
import com.it.utill.TokenUtil;
import com.sun.org.apache.bcel.internal.generic.NEW;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("follow")
@RestController
public class FollowController {
    @Autowired
    private FollowService followService;

    @Autowired
    private TokenUtil tokenUtil;

    @RequestMapping("list")
    public Result list(@RequestBody Follow follow) {

        List<Follow> list = followService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        Follow byId = followService.getById(id);
        return Result.ok(byId);

    }

    // 检查是否关注
    @GetMapping("/check")
    public Result checkFollow(@RequestParam("userId") Integer userId, HttpServletRequest request) {
        // 获取当前登录用户
        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String myUserId = stringStringMap.get("userId");


        QueryWrapper<Follow> eq = new QueryWrapper<Follow>().eq("user_id", myUserId).eq("followed_user_id", userId);
        // 检查是否关注
        Follow one = followService.getOne(eq);

        if (one == null) {
            return Result.ok();
        } else {
            return Result.ok(one);
        }


    }

    //  关注
    @PostMapping("add")
    public Result save(@RequestBody Follow follow, HttpServletRequest request) {

        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");
        follow.setUserId(Integer.valueOf(userId));


        boolean b = followService.save(follow);
        Follow byId = followService.getById(follow.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody Follow follow) {

        boolean b = followService.updateById(follow);
        Follow byId = followService.getById(follow.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete")
    public Result delete(@RequestParam("id") Integer id) {
        boolean byId = followService.removeById(id);
        return Result.ok();
    }

    //获取关注统计
    @GetMapping("stats")
    public Result getFollowStats(HttpServletRequest request) {
        HashMap<String, Long> map = new HashMap<>();
        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");
        QueryWrapper<Follow> followQueryWrapper = new QueryWrapper<>();
        followQueryWrapper.eq("user_id", userId);
        long count1 = followService.count(followQueryWrapper);

        map.put("followingCount", count1);
        followQueryWrapper = new QueryWrapper<>();
        followQueryWrapper.eq("followed_user_id", userId);
        long count2 = followService.count(followQueryWrapper);
        map.put("fansCount", count2);
        return Result.ok(map);
    }

    // 获取关注列表
    @PostMapping("GuanZhuList")
    public Result getGuanZhuList(HttpServletRequest request, @RequestBody FollowQuery followQuery) {
        try {
            // 获取当前用户ID
            String token = request.getHeader("token");
            if (token == null || token.isEmpty()) {
                return Result.fail("未登录或token无效");
            }
            
            Map<String, String> tokenData = tokenUtil.parseToken(token);
            String userId = tokenData.get("userId");
            if (userId == null || userId.isEmpty()) {
                return Result.fail("获取用户信息失败");
            }
            
            // 设置查询参数
            followQuery.setUserId(userId);
            
            // 调用服务获取关注列表
            Page<FollowAllDTO> list = followService.listJoinUserAndUserPrivacy(followQuery, "user_id");
            
            return Result.ok(list);
        } catch (Exception e) {
            return Result.fail("获取关注列表失败: " + e.getMessage());
        }
    }

    // 获取粉丝列表
    @PostMapping("FenSiList")
    public Result getFenSiList(HttpServletRequest request, @RequestBody FollowQuery followQuery) {
        try {
            // 获取当前用户ID
            String token = request.getHeader("token");
            if (token == null || token.isEmpty()) {
                return Result.fail("未登录或token无效");
            }
            
            Map<String, String> tokenData = tokenUtil.parseToken(token);
            String userId = tokenData.get("userId");
            if (userId == null || userId.isEmpty()) {
                return Result.fail("获取用户信息失败");
            }
            
            // 设置查询参数
            followQuery.setUserId(userId);
            
            // 调用服务获取粉丝列表
            Page<FollowAllDTO> list = followService.listJoinUserAndUserPrivacy(followQuery, "followed_user_id");
            
            return Result.ok(list);
        } catch (Exception e) {
            return Result.fail("获取粉丝列表失败: " + e.getMessage());
        }
    }
}
