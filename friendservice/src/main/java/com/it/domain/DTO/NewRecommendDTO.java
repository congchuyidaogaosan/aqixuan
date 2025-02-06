package com.it.domain.DTO;

import com.it.domain.User;
import lombok.Data;

import java.util.HashMap;
import java.util.List;

@Data
public class NewRecommendDTO {


    private HashMap<Integer, UserDTO> hashMap;

    private int[][] array;

}
