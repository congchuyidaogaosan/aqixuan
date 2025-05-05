package com.it.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Blacklist;
import com.it.domain.DTO.NewRecommendDTO;
import com.it.domain.DTO.UserDTO;
import com.it.domain.Follow;
import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.service.BlacklistService;
import com.it.service.FollowService;
import com.it.service.RecommendService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendServiceImpl implements RecommendService {


    @Autowired
    private FollowService followService;

    @Autowired
    private BlacklistService blacklistService;

    @Autowired
    private UserService userService;

    public Result<NewRecommendDTO> list(Integer userId) {
        System.out.println("开始为用户ID " + userId + " 准备推荐数据");

        // 获取当前用户的关注列表和黑名单
        List<Follow> follows = followService.list(new QueryWrapper<Follow>().eq("user_id", userId));
        List<Blacklist> blacklists = blacklistService.list(new QueryWrapper<Blacklist>().eq("user_id", userId));

        System.out.println("用户关注列表: " + follows.size() + " 条记录");
        System.out.println("用户黑名单: " + blacklists.size() + " 条记录");

        // 获取所有用户
        List<User> list = userService.list();
        System.out.println("系统总用户数: " + list.size() + " 人");

        // 创建用户索引映射表
        HashMap<Integer, Integer> userIdToIndexMap = new HashMap<>();
        HashMap<Integer, User> indexToUserMap = new HashMap<>();
        
        // 创建一个列表，用于存储用户关系矩阵
        ArrayList<List<Integer>> integers = new ArrayList<>();

        int index = 0;
        for (User user : list) {
            // 建立用户ID到索引的映射
            userIdToIndexMap.put(user.getId(), index);
            // 建立索引到用户对象的映射
            indexToUserMap.put(index, user);
            
            // 获取当前用户的关注列表
            List<Follow> followList = followService.list(new QueryWrapper<Follow>().eq("user_id", user.getId()));
            
            // 为当前用户生成与系统中所有用户的关系数据
            List<Integer> relationData = number(list, followList);
            integers.add(relationData);
            
            index++;
        }
        
        // 查找请求用户在映射中的索引
        Integer requestUserIndex = userIdToIndexMap.get(userId);
        if (requestUserIndex == null) {
            System.out.println("警告: 未找到请求用户ID " + userId + " 的索引映射!");
        } else {
            System.out.println("请求用户ID " + userId + " 在矩阵中的索引是: " + requestUserIndex);
        }

        NewRecommendDTO newRecommendDTO = new NewRecommendDTO();

        // 将关系列表转换为二维数组
        int[][] array = convertListTo2DArray(integers);
        System.out.println("生成关系矩阵: " + array.length + " x " + (array.length > 0 ? array[0].length : 0));

        // 输出请求用户的关系数据，帮助调试
        if (requestUserIndex != null && requestUserIndex < array.length) {
            System.out.print("请求用户的关系向量: [ ");
            for (int i = 0; i < array[requestUserIndex].length; i++) {
                System.out.print(array[requestUserIndex][i] + " ");
            }
            System.out.println("]");
        }

        newRecommendDTO.setArray(array);
        newRecommendDTO.setHashMap(indexToUserMap);
        
        // 添加索引映射，帮助调试
        System.out.println("用户ID到索引映射:");
        for (Map.Entry<Integer, Integer> entry : userIdToIndexMap.entrySet()) {
            System.out.println("  用户ID " + entry.getKey() + " -> 索引 " + entry.getValue());
        }
        
        return Result.ok(newRecommendDTO);
    }


    public static int[][] convertListTo2DArray(List<List<Integer>> list) {
        int rows = list.size();
        // 初始化二维数组，假设每个子列表长度相同
        int cols = list.get(0).size();
        int[][] array = new int[rows][cols];

        for (int i = 0; i < rows; i++) {
            List<Integer> subList = list.get(i);
            for (int j = 0; j < cols; j++) {
                array[i][j] = subList.get(j);
            }
        }
        return array;
    }


    private LinkedList<Integer> number(List<User> users, List<Follow> follows) {
        LinkedList<Integer> integers = new LinkedList<>();

        for (User user : users) {
            integers.addLast(0);
            for (Follow follow : follows) {
                if (follow.getFollowedUserId().equals(user.getId())) {
                    integers.removeLast();
                    integers.addLast(1);
                    break;
                }
            }
        }
        return integers;
    }
}
