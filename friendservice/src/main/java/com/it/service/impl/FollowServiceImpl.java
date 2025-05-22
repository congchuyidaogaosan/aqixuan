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
        // 构建联表查询
        MPJLambdaWrapper<Follow> wrapper = new MPJLambdaWrapper<>();
        wrapper.selectAll(Follow.class).selectAll(User.class);
        
        // 根据类型选择不同的连接方式
        if (DTO.equals("user_id")) {
            wrapper.leftJoin(User.class, User::getId, Follow::getFollowedUserId);
        } else {
            wrapper.leftJoin(User.class, User::getId, Follow::getUserId);
        }

        // 设置查询条件
        wrapper.eq("t." + DTO, followQuery.getUserId());

        // 处理关注时间排序
        if (followQuery.getPayAttentionToTime()) {
            if (followQuery.getORDER().equals("DESC")) {
                wrapper.orderByDesc("t.created_at");
            } else {
                wrapper.orderByAsc("t.created_at");
            }
        }

        // 处理距离排序
        if (followQuery.getDistance()) {
            if (followQuery.getORDER().equals("DESC")) {
                wrapper.orderByDesc("t.created_at");
            } else {
                wrapper.orderByAsc("t.created_at");
            }
        }

        // 处理年龄过滤
        if ((followQuery.getMaxAge() != null && followQuery.getMinAge() != null)
                && (!followQuery.getMaxAge().equals("") && !followQuery.getMinAge().equals(""))) {
            wrapper.ge("t1.birthday", followQuery.getMaxAge()).le("t1.birthday", followQuery.getMinAge());
        }

        // 处理昵称模糊搜索
        if (followQuery.getNickName() != null && !followQuery.getNickName().equals("")) {
            wrapper.like("t1.nickname", followQuery.getNickName());
        }
        
        // 处理角色过滤
        if (followQuery.getRole() != null && !followQuery.getRole().equals("")) {
            wrapper.eq("t1.role_type", followQuery.getRole());
        }

        // 执行分页查询
        Page<FollowAllDTO> followAllDTOPage = followMapper.selectJoinPage(
            new Page<>(followQuery.getPage(), followQuery.getLimit()), 
            FollowAllDTO.class, 
            wrapper
        );
        
        List<FollowAllDTO> records = followAllDTOPage.getRecords();

        // 如果结果为空，直接返回
        if (records == null || records.isEmpty()) {
            return followAllDTOPage;
        }

        // 获取当前用户信息
        User currentUser = userService.getById(followQuery.getUserId());
        
        // 为每个记录设置头像
        for (FollowAllDTO followAllDTO : records) {
            // 初始化设置默认头像
            followAllDTO.setAvatarUrl("/static/images/default-avatar.png");
            
            // 确定要查询的用户ID
            Integer targetUserId;
            if (DTO.equals("user_id")) {
                // 关注列表：需要获取被关注者的头像
                targetUserId = followAllDTO.getFollowedUserId();
            } else {
                // 粉丝列表：需要获取粉丝的头像
                targetUserId = followAllDTO.getUserId();
            }
            
            try {
                // 查询用户最新的头像
                QueryWrapper<UserAvatar> queryWrapper = new QueryWrapper<>();
                queryWrapper.eq("user_id", targetUserId).orderByDesc("created_at").last("LIMIT 1");
    
                UserAvatar avatar = userAvatarService.getOne(queryWrapper);
                if (avatar != null && avatar.getAvatarUrl() != null && !avatar.getAvatarUrl().isEmpty()) {
                    followAllDTO.setAvatarUrl(avatar.getAvatarUrl());
                }
            } catch (Exception e) {
                // 如果查询出错，保持默认头像
                System.err.println("获取用户 " + targetUserId + " 头像失败: " + e.getMessage());
            }
        }

        // 注意：原代码中的位置计算部分已被注释掉，但保留了存根
        // 如果需要恢复位置计算功能，请取消下面的注释并实现相应的逻辑
        /*
        // 构建IP地址字符串，用于批量计算距离
        StringBuilder ipAddresses = new StringBuilder();
        for (FollowAllDTO followAllDTO : records) {
            String ipAddress = followAllDTO.getIpAddress();
            if (ipAddress != null && !ipAddress.isEmpty()) {
                ipAddresses.append(ipAddress).append("|");
            }
        }
        
        // 确保有IP地址再进行处理
        if (ipAddresses.length() > 0) {
            // 移除最后一个分隔符
            String ipString = ipAddresses.substring(0, ipAddresses.length() - 1);
            
            // 调用高德API计算距离
            if (currentUser != null && currentUser.getIpAddress() != null) {
                List<Results> distances = positioningController.CalculateTwoPlacesAll(ipString, currentUser.getIpAddress()).getData();
                
                // 将距离信息添加到返回结果中
                for (int i = 0; i < Math.min(records.size(), distances.size()); i++) {
                    FollowAllDTO followAllDTO = records.get(i);
                    Results results = distances.get(i);
                    followAllDTO.setPositioning(results.getDistance());
                }
            }
        }
        */

        return followAllDTOPage;
    }
}




