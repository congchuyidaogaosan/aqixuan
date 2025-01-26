package com.it.domain.tree;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.it.domain.MomentComment;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class MomentCommentTree  {


    /**
     *
     */
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

    private List<MomentCommentTree> momentCommentTree;

}
