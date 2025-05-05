package com.it.Controller;

import com.it.domain.DTO.NewRecommendDTO;
import com.it.domain.DTO.UserDTO;
import com.it.domain.DTO.UserInfoDTO;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.*;
import com.it.utill.FriendRecommendation;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;


@RestController()
@RequestMapping("Recommend")
public class RecommendedController {


    @Autowired
    private RecommendService recommendService;

    @Autowired
    private FriendRecommendation friendRecommendation;

    @Autowired
    private UserAvatarService userAvatarService;

    @Autowired
    private TokenUtil tokenUtil;

    @GetMapping("/{page}/{size}")
    public Result recommend(HttpServletRequest request, @PathVariable("page") Integer page, @PathVariable("size") Integer size) {

        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        //我的ID
        String userId = stringStringMap.get("userId");
        Integer userIdInt = Integer.valueOf(userId);
        
        System.out.println("当前用户ID: " + userIdInt + ", 请求页码: " + page + ", 页大小: " + size);

        // 计算推荐数量，确保至少有足够数据支持分页
        int numRecommendations = Math.max(page * size, 20); // 确保有足够多的推荐结果供分页
        
        // 获取推荐所需数据和用户映射
        Result<NewRecommendDTO> list = recommendService.list(userIdInt);
        
        // 从hashMap中查找当前用户的矩阵索引
        int targetUserIndex = -1;
        HashMap<Integer, User> hashMap = list.getData().getHashMap();
        
        // 寻找当前用户在矩阵中的索引
        for (Map.Entry<Integer, User> entry : hashMap.entrySet()) {
            if (entry.getValue().getId().equals(userIdInt)) {
                targetUserIndex = entry.getKey();
                break;
            }
        }
        
        if (targetUserIndex == -1) {
            System.out.println("错误: 未能找到用户 " + userIdInt + " 在矩阵中的索引");
            return Result.fail("无法获取推荐数据");
        }
        
        System.out.println("找到当前用户在矩阵中的索引: " + targetUserIndex);

        int[][] data = list.getData().getArray();
        
        // 输出矩阵维度，帮助调试
        System.out.println("用户关系矩阵维度: " + data.length + " x " + (data.length > 0 ? data[0].length : 0));

        // 使用静态方法进行推荐，获取比页面所需更多的推荐结果
        List<Integer> recommendedFriends = FriendRecommendation.recommendFriendsStatic(data, targetUserIndex, numRecommendations);
        
        // 输出推荐好友索引列表
        System.out.println("推荐好友索引列表: " + recommendedFriends);

        // 转换所有推荐结果为UserInfoDTO对象
        List<UserInfoDTO> allRecommendedUsers = new ArrayList<>();
        for (Integer thisint : recommendedFriends) {
            User user = hashMap.get(thisint);
            if (user != null) {
                System.out.println("处理推荐用户: 索引=" + thisint + ", 用户ID=" + user.getId() + ", 昵称=" + user.getNickname());
                UserInfoDTO userInfoDTO = new UserInfoDTO();
                userInfoDTO.setUser(user);

                List<String> avatarList = userAvatarService.getAvatarList(user.getId(), 3);
                userInfoDTO.setUrl(avatarList);
                allRecommendedUsers.add(userInfoDTO);
            } else {
                System.out.println("警告: 未找到索引为 " + thisint + " 的用户");
            }
        }
        
        // 应用分页
        List<UserInfoDTO> pagedUsers;
        int startIndex = (page - 1) * size;
        int endIndex = Math.min(startIndex + size, allRecommendedUsers.size());
        
        if (startIndex < allRecommendedUsers.size()) {
            pagedUsers = allRecommendedUsers.subList(startIndex, endIndex);
        } else {
            pagedUsers = new ArrayList<>(); // 如果页码超出范围，返回空列表
        }
        
        System.out.println("总推荐用户数量: " + allRecommendedUsers.size());
        System.out.println("返回分页后的推荐用户数量: " + pagedUsers.size() + 
                           " (页码 " + page + ", 每页 " + size + 
                           ", 起始索引 " + startIndex + ", 结束索引 " + endIndex + ")");
        
        if (pagedUsers.isEmpty() && page > 1) {
            System.out.println("警告: 请求的页码 " + page + " 超出了可用结果范围");
        }
        
        // 创建分页结果对象
        Map<String, Object> result = new HashMap<>();
        result.put("list", pagedUsers);
        result.put("total", allRecommendedUsers.size());
        result.put("page", page);
        result.put("size", size);
        result.put("pages", (int) Math.ceil(allRecommendedUsers.size() / (double) size));
        
        return Result.ok(result);
    }
}
