package com.it.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.yulichang.query.MPJLambdaQueryWrapper;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import com.it.domain.*;
import com.it.domain.DTO.FollowAllDTO;
import com.it.service.FollowService;
import com.it.mapper.FollowMapper;
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

    @Override
    public List<FollowAllDTO> listJoinUserAndUserPrivacy(String userId,String DTO) {


        MPJLambdaWrapper<Follow> wrapper = new MPJLambdaWrapper<>();
        wrapper.selectAll(Follow.class).selectAll(User.class).selectAll(UserAvatar.class)
                .leftJoin(User.class, User::getId, Follow::getUserId)
                .leftJoin(UserAvatar.class, UserAvatar::getUserId, Follow::getUserId);
        wrapper.eq("t."+DTO, userId);
        List<FollowAllDTO> followAllDTOS = followMapper.selectJoinList(FollowAllDTO.class, wrapper);
        return followAllDTOS;
    }
}




