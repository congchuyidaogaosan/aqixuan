package com.it.service;

import com.it.domain.DTO.FollowAllDTO;
import com.it.domain.Follow;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 *
 */
public interface FollowService extends IService<Follow> {

    List<FollowAllDTO> listJoinUserAndUserPrivacy(String userId,String DTO);
}
