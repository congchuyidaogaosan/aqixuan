package com.it.domain.DTO;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowAllDTO {


    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 关注者ID
     */
    private Integer userId;

    /**
     * 被关注者ID
     */
    private Integer followedUserId;


    /**
     * 头像URL
     */
    private String avatarUrl;

    /**
     * 排序顺序
     */
    private Integer sortOrder;

    /**
     *
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;


    /**
     * 手机号
     */
    private String phone;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 个人介绍
     */
    private String introduction;

    /**
     * 居住地
     */
    private String location;

    /**
     * 身高(cm)
     */
    private Integer height;

    /**
     * 体重(kg)
     */
    private Integer weight;

    /**
     * 生日
     */
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date birthday;

    /**
     * 角色类型
     */
    private String roleType;

    /**
     * 行业
     */
    private String industry;

    /**
     * 情感状态
     */
    private String emotionStatus;

    /**
     * MBTI类型
     */
    private String mbti;

    /**
     * 交友目的
     */
    private String datingPurpose;

    /**
     * 兴趣爱好
     */
    private String interests;

    /**
     * 运动爱好
     */
    private String sports;

    /**
     * IP地址
     */
    private String ipAddress;

    /**
     * 是否实名认证
     */
    private Boolean isVerified;


    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}
