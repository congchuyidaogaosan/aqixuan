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

    private Boolean payAttentionToTime=false;
<<<<<<< HEAD
    private Boolean Distance=false;;
=======
    private Boolean Distance=false;
>>>>>>> f387c18a38b395cba81bd79627447da65f8a4166

    private String NickName;
    private String UserId;

    private String MaxAge;
    private String MinAge;

    private String Role;
}
