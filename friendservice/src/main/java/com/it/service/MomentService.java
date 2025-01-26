package com.it.service;

import com.it.domain.DTO.MomentDTO;
import com.it.domain.Moment;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 *
 */
public interface MomentService extends IService<Moment> {

    List<MomentDTO> ListMomentDTO(String userId);

    List<MomentDTO> ListMomentDTOByID(String id);

}
