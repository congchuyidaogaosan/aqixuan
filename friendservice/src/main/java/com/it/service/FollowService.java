package com.it.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.DTO.FollowAllDTO;
import com.it.domain.Follow;
import com.baomidou.mybatisplus.extension.service.IService;
import com.it.domain.query.FollowQuery;

import java.util.List;

/**
 *
 */
public interface FollowService extends IService<Follow> {

    Page<FollowAllDTO> listJoinUserAndUserPrivacy(FollowQuery followQuery, String DTO);
}
