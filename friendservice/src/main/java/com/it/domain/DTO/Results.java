package com.it.domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Results {

    private String origin_id;
    private String dest_id;
    private String distance;
    private String duration;

}
