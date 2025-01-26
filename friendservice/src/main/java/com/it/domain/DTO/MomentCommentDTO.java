package com.it.domain.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class MomentCommentDTO {


    private Integer id;

    /**
     * 动态ID
     */
    private Integer momentId;

    /**
     * 评论用户ID
     */
    private Integer userId;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 父评论ID
     */
    private Integer parentId;

    /**
     *
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    private String avatarUrl;


    private String nickname;

}
