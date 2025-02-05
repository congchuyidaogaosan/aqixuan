package com.it.service;

import com.it.domain.DTO.NewRecommendDTO;
import com.it.domain.common.Result;

public interface RecommendService {


    Result<NewRecommendDTO> list(Integer userId);


}
