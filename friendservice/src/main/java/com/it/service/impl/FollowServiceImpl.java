package com.it.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.yulichang.query.MPJLambdaQueryWrapper;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import com.it.Controller.PositioningController;
import com.it.domain.*;
import com.it.domain.DTO.FollowAllDTO;
import com.it.domain.DTO.Results;
import com.it.domain.common.Result;
import com.it.domain.query.FollowQuery;
import com.it.mapper.UserMapper;
import com.it.service.FollowService;
import com.it.mapper.FollowMapper;
import com.it.service.UserAvatarService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *
 */
@Service
public class FollowServiceImpl extends ServiceImpl<FollowMapper, Follow>
        implements FollowService {

    @Autowired
    private FollowMapper followMapper;

    @Autowired
    private PositioningController positioningController;

    @Autowired
    private UserService userService;

    @Autowired
    private UserAvatarService userAvatarService;

    @Override
    public Page<FollowAllDTO> listJoinUserAndUserPrivacy(FollowQuery followQuery, String DTO) {

        MPJLambdaWrapper<Follow> wrapper = new MPJLambdaWrapper<>();
        wrapper.selectAll(Follow.class).selectAll(User.class);
        if (DTO.equals("user_id")) {
            wrapper.leftJoin(User.class, User::getId, Follow::getFollowedUserId);
        } else {
            wrapper.leftJoin(User.class, User::getId, Follow::getUserId);
        }


        wrapper.eq("t." + DTO, followQuery.getUserId());

        if (followQuery.getPayAttentionToTime()) {
            if (followQuery.getORDER().equals("DESC")) {
                wrapper.orderByDesc("t.created_at");
            } else {
                wrapper.orderByAsc("t.created_at");
            }
        }

        if (followQuery.getDistance()) {
            if (followQuery.getORDER().equals("DESC")) {
                wrapper.orderByDesc("t.created_at");
            } else {
                wrapper.orderByAsc("t.created_at");
            }
        }

        if ((followQuery.getMaxAge() != null && followQuery.getMinAge() != null)
                && (!followQuery.getMaxAge().equals("") && !followQuery.getMinAge().equals(""))) {
            wrapper.ge("t1.birthday", followQuery.getMaxAge()).le("t1.birthday", followQuery.getMinAge());
        }

        if (followQuery.getNickName() != null && !followQuery.getNickName().equals("")) {
            wrapper.like("t1.nickname", followQuery.getNickName());
        }
        if (followQuery.getRole() != null && !followQuery.getRole().equals("")) {
            wrapper.eq("t1.role_type", followQuery.getRole());
        }

        Page<FollowAllDTO> followAllDTOPage = followMapper.selectJoinPage(new Page<>(followQuery.getPage(), followQuery.getLimit()), FollowAllDTO.class, wrapper);
        List<FollowAllDTO> records = followAllDTOPage.getRecords();

        User byId = userService.getById(followQuery.getUserId());
        StringBuilder stringBuilder = new StringBuilder();
        if (records == null || records.size()==0){
            return followAllDTOPage;
        }
        for (FollowAllDTO followAllDTO : records) {
            String ipAddress = followAllDTO.getIpAddress();
            stringBuilder.append(ipAddress).append("|");

            QueryWrapper<UserAvatar> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", followQuery.getUserId()).orderByDesc("created_at").last("LIMIT 1");

            UserAvatar one = userAvatarService.getOne(queryWrapper);
            followAllDTO.setAvatarUrl(one.getAvatarUrl());
        }

        String substring = stringBuilder.substring(0, stringBuilder.length() - 1);

        List<Results> data = positioningController.CalculateTwoPlacesAll(substring, byId.getIpAddress()).getData();

        for (int a = 0; a < records.size(); a++) {
            Results results = data.get(a);
            FollowAllDTO followAllDTO = records.get(a);
            followAllDTO.setPositioning(results.getDistance());
        }


        return followAllDTOPage;

    }
}




