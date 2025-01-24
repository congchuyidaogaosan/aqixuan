package com.it.domain.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowQuery {


    private Integer page = 1;
    private Integer limit = 5;

    private String ORDER="DESC";

    private Boolean payAttentionToTime;
    private Boolean Distance;

    private String NickName;
    private String UserId;

    private String MaxAge;
    private String MinAge;

    private String Role;
}
