package com.it.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import com.it.domain.DTO.MomentCommentDTO;
import com.it.domain.DTO.MomentDTO;
import com.it.domain.Moment;
import com.it.domain.MomentComment;
import com.it.domain.MomentMedia;
import com.it.domain.User;
import com.it.domain.tree.MomentCommentTree;
import com.it.service.MomentCommentService;
import com.it.service.MomentLikeService;
import com.it.service.MomentService;
import com.it.mapper.MomentMapper;
import com.it.service.UserAvatarService;
import com.it.utill.TreeUtil;
import org.springframework.beans.BeanUtils;
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

    @Autowired
    private MomentLikeService momentLikeService;

    @Autowired
    private MomentCommentService momentCommentService;

    @Autowired
    private TreeUtil treeUtil;

    @Autowired
    private UserAvatarService userAvatarService;

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
            Boolean aBoolean = momentLikeService.listMoment(moment.getId());
            momentDTO.setIsLike(aBoolean);
            arrayList.add(momentDTO);
            momentDTO.setMomentComments(momentCommentService.selectParentId( moment.getId()));
        }
        return arrayList;
    }

    @Override
    public List<MomentDTO> ListMomentDTOByID(String id) {
        QueryWrapper<Moment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", id);
       Moment moment = momentMapper.selectList(queryWrapper).get(0);
        List<MomentDTO> arrayList = new ArrayList<>();
        MomentDTO momentDTO =null;

            QueryWrapper<MomentMedia> momentMediaQueryWrapper = new QueryWrapper<>();
            momentMediaQueryWrapper.eq("moment_id", moment.getId());
            List<MomentMedia> list = momentMediaService.list(momentMediaQueryWrapper);
            Boolean aBoolean = momentLikeService.listMoment(moment.getId());
            momentDTO= new MomentDTO(moment, list);
            momentDTO.setIsLike(aBoolean);

            List<MomentComment> moment_id = momentCommentService.list(new QueryWrapper<MomentComment>().eq("moment_id", moment.getId()));

            for (MomentComment momentComment:moment_id){
                User byId = userAvatarService.findById(momentComment.getUserId());
                momentComment.setNickname(byId.getNickname());
                momentComment.setHandImg(byId.getHandImg());
            }

            List<MomentCommentTree> tree = treeUtil.getDetailTree(moment_id,moment.getId());
           
            momentDTO.setMomentCommentTree(tree);
            arrayList.add(momentDTO);






        return arrayList;
    }

}




