package com.it.service.impl;

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

    @Override
    public Page<FollowAllDTO> listJoinUserAndUserPrivacy(FollowQuery followQuery, String DTO) {

        MPJLambdaWrapper<Follow> wrapper = new MPJLambdaWrapper<>();
        wrapper.selectAll(Follow.class).selectAll(User.class).selectAll(UserAvatar.class)
                .leftJoin(User.class, User::getId, Follow::getUserId)
                .leftJoin(UserAvatar.class, UserAvatar::getUserId, Follow::getUserId);
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
            wrapper.ge("t1.", followQuery.getMinAge()).le("", followQuery.getMaxAge());
        }

        if (followQuery.getNickName() != null && !followQuery.getNickName().equals("")) {
            wrapper.like("nickname", followQuery.getNickName());
        }
        if (followQuery.getRole() != null && !followQuery.getRole().equals("")) {
            wrapper.eq("role_type", followQuery.getRole());
        }

        Page<FollowAllDTO> followAllDTOPage = followMapper.selectJoinPage(new Page<>(followQuery.getPage(), followQuery.getLimit()), FollowAllDTO.class, wrapper);
        List<FollowAllDTO> records = followAllDTOPage.getRecords();

        User byId = userService.getById(followQuery.getUserId());
        StringBuilder stringBuilder = new StringBuilder();
        for (FollowAllDTO followAllDTO:records){
            String ipAddress = followAllDTO.getIpAddress();
            stringBuilder.append(ipAddress).append("|");
        }

        stringBuilder.substring(0,stringBuilder.length()-1);

        List<Results> data = positioningController.CalculateTwoPlacesAll(stringBuilder.toString(), byId.getIpAddress()).getData();

        for (int a=0;a<records.size();a++){
            Results results = data.get(a);
            FollowAllDTO followAllDTO = records.get(a);
            followAllDTO.setPositioning(results.getDistance());
        }

        return followAllDTOPage;

    }
}




