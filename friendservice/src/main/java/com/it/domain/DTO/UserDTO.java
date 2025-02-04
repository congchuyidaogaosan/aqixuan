package com.it.domain.DTO;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class UserDTO {

    /**
     * 用户ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

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

    /**
     * 是否注销
     */
    private Boolean isDeleted;

    /**
     * 注销时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date deleteTime;

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

    /**
     * 头像URL
     */
    private String avatarUrl;

    /**
     * 排序顺序
     */
    private Integer sortOrder;

}
