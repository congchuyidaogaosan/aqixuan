package com.it.Controller;

import com.it.domain.DTO.NewRecommendDTO;
import com.it.domain.User;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
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

        Result<NewRecommendDTO> list = recommendService.list(1);
        int targetUser = 0;

        int numRecommendations = 10;

        int[][] data = list.getData().getArray();

        List<Integer> recommendedFriends = friendRecommendation.recommendFriends(data, targetUser, numRecommendations);

        HashMap<Integer, User> hashMap = list.getData().getHashMap();
        List<User> users = new ArrayList<>();
        for (Integer thisint:recommendedFriends){
            User list1 = hashMap.get(thisint);
            users.add(list1);
        }


        return Result.ok(users);

    }


}
