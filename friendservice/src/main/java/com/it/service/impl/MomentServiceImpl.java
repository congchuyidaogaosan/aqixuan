package com.it.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import com.it.domain.DTO.MomentDTO;
import com.it.domain.Moment;
import com.it.domain.MomentMedia;
import com.it.service.MomentService;
import com.it.mapper.MomentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 *
 */
@Service
public class MomentServiceImpl extends ServiceImpl<MomentMapper, Moment>
        implements MomentService {

    @Autowired
    private MomentMapper momentMapper;

    @Autowired
    private MomentMediaServiceImpl momentMediaService;

    @Override
    public List<MomentDTO> ListMomentDTO(String userId) {

        QueryWrapper<Moment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        List<Moment> moments = momentMapper.selectList(queryWrapper);
        List<MomentDTO> arrayList = new ArrayList<>();
        for (Moment moment : moments) {
            QueryWrapper<MomentMedia> momentMediaQueryWrapper = new QueryWrapper<>();
            momentMediaQueryWrapper.eq("moment_id", moment.getId());
            List<MomentMedia> list = momentMediaService.list(momentMediaQueryWrapper);
            MomentDTO momentDTO = new MomentDTO(moment, list);
            arrayList.add(momentDTO);
        }

//        lambdaWrapper.selectAll(Moment.class).select(MomentMedia::getMediaUrl).select(MomentMedia::getMediaType)
//                .leftJoin(Moment.class, Moment::getId, MomentMedia::getMomentId);
//        List<MomentDTO> list = momentMapper.selectJoinList(MomentDTO.class, lambdaWrapper);

        return arrayList;
    }
}




