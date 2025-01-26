package com.it.service;

import com.it.domain.MomentComment;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 *
 */
public interface MomentCommentService extends IService<MomentComment> {


     Integer NumberOfResponses(Integer id);

      List<MomentComment> selectParentId(Integer momentId);
}
