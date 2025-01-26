package com.it.service;

import com.it.domain.MomentLike;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 *
 */
public interface MomentLikeService extends IService<MomentLike> {

    Boolean listMoment(Integer id,Integer userId);
}
