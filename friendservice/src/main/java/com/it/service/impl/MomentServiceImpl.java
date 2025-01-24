package com.it.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import com.it.domain.DTO.MomentDTO;
import com.it.domain.Moment;
import com.it.domain.MomentMedia;
import com.it.service.MomentService;
import com.it.mapper.MomentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *
 */
@Service
public class MomentServiceImpl extends ServiceImpl<MomentMapper, Moment>
        implements MomentService {

    @Autowired
    private MomentMapper momentMapper;

    @Override
    public List<MomentDTO> ListMomentDTO(String userId) {

        MPJLambdaWrapper<Moment> lambdaWrapper = new MPJLambdaWrapper<>();

        lambdaWrapper.selectAll(Moment.class).select(MomentMedia::getMediaUrl).select(MomentMedia::getMediaType)
                .leftJoin(Moment.class, Moment::getId, MomentMedia::getMomentId);
        List<MomentDTO> list = momentMapper.selectJoinList(MomentDTO.class, lambdaWrapper);

        return list;
    }
}




