package com.it.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.it.domain.MomentComment;
import com.it.service.MomentCommentService;
import com.it.mapper.MomentCommentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 *
 */
@Service
public class MomentCommentServiceImpl extends ServiceImpl<MomentCommentMapper, MomentComment>
    implements MomentCommentService{

    @Autowired
    private MomentCommentMapper momentCommentMapper;

    @Override
    public Integer NumberOfResponses(Integer id) {
        QueryWrapper<MomentComment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("parent_id",id);
        return   Integer.valueOf(momentCommentMapper.selectCount(queryWrapper)+"") ;
    }


    public List<MomentComment> selectParentId(Integer momentId){

        QueryWrapper<MomentComment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("moment_id",momentId).eq("parent_id",0);
        List<MomentComment> momentComments = momentCommentMapper.selectList(queryWrapper);

        if (momentComments.size()<=1){
            return momentComments;
        }

        int flag=-1;
        MomentComment returnMomentComment=null;
        for (MomentComment momentComment:momentComments){


            Integer integer = NumberOfResponses(momentComment.getId());

            if (integer>flag){
                returnMomentComment=momentComment;
            }

        }

        ArrayList<MomentComment> momentComments1 = new ArrayList<>();
       momentComments1.add(returnMomentComment);
        return momentComments1;

    }




}




