package com.it.domain.DTO;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.it.domain.Moment;
import com.it.domain.MomentMedia;
import lombok.Data;

import java.util.Date;

@Data
public class MomentDTO extends Moment {

    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 动态内容
     */
    private String content;

    /**
     * 发布地点
     */
    private String location;

    /**
     * 点赞数
     */
    private Integer likesCount;

    /**
     * 评论数
     */
    private Integer commentsCount;

    /**
     *
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    /**
     *
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    private String mediaUrl;

    private String mediaType;

    public MomentDTO(Moment moment, MomentMedia momentMedia) {
        this.id = moment.getId();
        this.userId = moment.getUserId();
        this.content = moment.getContent();
        this.location = moment.getLocation();
        this.likesCount = moment.getLikesCount();
        this.commentsCount = moment.getCommentsCount();
        this.createdAt = moment.getCreatedAt();
        this.updatedAt = moment.getUpdatedAt();
        this.mediaUrl = momentMedia.getMediaUrl();
        this.mediaType = momentMedia.getMediaType();
    }
}
