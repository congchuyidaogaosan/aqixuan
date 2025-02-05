package com.it.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Blacklist;
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

    public Result<int[][]> list(Integer userId) {


        List<Follow> follows = followService.list(new QueryWrapper<Follow>().eq("user_id", userId));
        List<Blacklist> blacklists = blacklistService.list(new QueryWrapper<Blacklist>().eq("user_id", userId));

        List<User> list = userService.list();


        ArrayList<List<Integer>> integers = new ArrayList<>();

        System.out.println(Arrays.toString(follows.toArray()));
        System.out.println(Arrays.toString(blacklists.toArray()));

        HashMap<Integer,List<Integer>> hashMap = new HashMap<>();
        for (User user : list) {
            List<Follow> followList = followService.list(new QueryWrapper<Follow>().eq("user_id", user.getId()));
            List<Integer> number = number(list, followList);
            hashMap.put(user.getId(), number);

//            int size=number.size();
//            Integer[] arrs=number.toArray(new Integer[size]);
//            for(int i=0;i<size;i++){
//                arrs[i]=number.get(i);
//            }

            integers.add(number);
        }



        int[][] array = convertListTo2DArray(integers);


        return Result.ok(array);
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
                    integers.remove();
                    integers.addLast(1);
                    break;
                }
            }
        }
        return integers;
    }

}
