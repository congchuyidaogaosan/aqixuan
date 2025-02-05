package com.it.Controller;

import com.it.domain.common.Result;
import com.it.service.BlacklistService;
import com.it.service.FollowService;
import com.it.service.RecommendService;
import com.it.utill.FriendRecommendation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController()
@RequestMapping("Recommend")
public class RecommendedController {


    @Autowired
    private RecommendService recommendService;

    @Autowired
    private FriendRecommendation friendRecommendation;

    @GetMapping("/{page}/{size}")
    public Result recommend(@PathVariable("page") Integer page, @PathVariable("size") Integer size) {

        Result<int[][]> list = recommendService.list(1);
        int targetUser = 0;

        int numRecommendations = 10;

        List<Integer> recommendedFriends = friendRecommendation.recommendFriends(list.getData(), targetUser, numRecommendations);
        System.out.println("为用户 " + targetUser + " 推荐的朋友：" + recommendedFriends);
        return Result.ok(recommendedFriends);

    }


}
