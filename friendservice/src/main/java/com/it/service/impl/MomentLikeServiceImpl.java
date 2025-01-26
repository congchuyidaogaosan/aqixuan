package com.it.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.it.domain.MomentLike;
import com.it.service.MomentLikeService;
import com.it.mapper.MomentLikeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 *
 */
@Service
public class MomentLikeServiceImpl extends ServiceImpl<MomentLikeMapper, MomentLike>
    implements MomentLikeService{

    @Autowired
    private MomentLikeMapper momentLikeMapper;

    @Override
    public Boolean listMoment(Integer id) {

        MomentLike momentLike = momentLikeMapper.selectById(id);
        if (momentLike==null){
            return true;
        }else {
            return false;
        }

    }
}




