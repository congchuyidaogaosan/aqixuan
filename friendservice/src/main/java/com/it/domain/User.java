package com.it.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 用户基础信息表
 * @TableName user
 */
@TableName(value ="user")
@Data
public class User implements Serializable {
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
    private Date deleteTime;

    /**
     * 
     */
    private Date createdAt;

    /**
     * 
     */
    private Date updatedAt;

    @TableField(exist = false)
    private String handImg;



    @TableField(exist = false)
    private String token;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        User other = (User) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getPhone() == null ? other.getPhone() == null : this.getPhone().equals(other.getPhone()))
            && (this.getNickname() == null ? other.getNickname() == null : this.getNickname().equals(other.getNickname()))
            && (this.getIntroduction() == null ? other.getIntroduction() == null : this.getIntroduction().equals(other.getIntroduction()))
            && (this.getLocation() == null ? other.getLocation() == null : this.getLocation().equals(other.getLocation()))
            && (this.getHeight() == null ? other.getHeight() == null : this.getHeight().equals(other.getHeight()))
            && (this.getWeight() == null ? other.getWeight() == null : this.getWeight().equals(other.getWeight()))
            && (this.getBirthday() == null ? other.getBirthday() == null : this.getBirthday().equals(other.getBirthday()))
            && (this.getRoleType() == null ? other.getRoleType() == null : this.getRoleType().equals(other.getRoleType()))
            && (this.getIndustry() == null ? other.getIndustry() == null : this.getIndustry().equals(other.getIndustry()))
            && (this.getEmotionStatus() == null ? other.getEmotionStatus() == null : this.getEmotionStatus().equals(other.getEmotionStatus()))
            && (this.getMbti() == null ? other.getMbti() == null : this.getMbti().equals(other.getMbti()))
            && (this.getDatingPurpose() == null ? other.getDatingPurpose() == null : this.getDatingPurpose().equals(other.getDatingPurpose()))
            && (this.getInterests() == null ? other.getInterests() == null : this.getInterests().equals(other.getInterests()))
            && (this.getSports() == null ? other.getSports() == null : this.getSports().equals(other.getSports()))
            && (this.getIpAddress() == null ? other.getIpAddress() == null : this.getIpAddress().equals(other.getIpAddress()))
            && (this.getIsVerified() == null ? other.getIsVerified() == null : this.getIsVerified().equals(other.getIsVerified()))
            && (this.getIsDeleted() == null ? other.getIsDeleted() == null : this.getIsDeleted().equals(other.getIsDeleted()))
            && (this.getDeleteTime() == null ? other.getDeleteTime() == null : this.getDeleteTime().equals(other.getDeleteTime()))
            && (this.getCreatedAt() == null ? other.getCreatedAt() == null : this.getCreatedAt().equals(other.getCreatedAt()))
            && (this.getUpdatedAt() == null ? other.getUpdatedAt() == null : this.getUpdatedAt().equals(other.getUpdatedAt()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getPhone() == null) ? 0 : getPhone().hashCode());
        result = prime * result + ((getNickname() == null) ? 0 : getNickname().hashCode());
        result = prime * result + ((getIntroduction() == null) ? 0 : getIntroduction().hashCode());
        result = prime * result + ((getLocation() == null) ? 0 : getLocation().hashCode());
        result = prime * result + ((getHeight() == null) ? 0 : getHeight().hashCode());
        result = prime * result + ((getWeight() == null) ? 0 : getWeight().hashCode());
        result = prime * result + ((getBirthday() == null) ? 0 : getBirthday().hashCode());
        result = prime * result + ((getRoleType() == null) ? 0 : getRoleType().hashCode());
        result = prime * result + ((getIndustry() == null) ? 0 : getIndustry().hashCode());
        result = prime * result + ((getEmotionStatus() == null) ? 0 : getEmotionStatus().hashCode());
        result = prime * result + ((getMbti() == null) ? 0 : getMbti().hashCode());
        result = prime * result + ((getDatingPurpose() == null) ? 0 : getDatingPurpose().hashCode());
        result = prime * result + ((getInterests() == null) ? 0 : getInterests().hashCode());
        result = prime * result + ((getSports() == null) ? 0 : getSports().hashCode());
        result = prime * result + ((getIpAddress() == null) ? 0 : getIpAddress().hashCode());
        result = prime * result + ((getIsVerified() == null) ? 0 : getIsVerified().hashCode());
        result = prime * result + ((getIsDeleted() == null) ? 0 : getIsDeleted().hashCode());
        result = prime * result + ((getDeleteTime() == null) ? 0 : getDeleteTime().hashCode());
        result = prime * result + ((getCreatedAt() == null) ? 0 : getCreatedAt().hashCode());
        result = prime * result + ((getUpdatedAt() == null) ? 0 : getUpdatedAt().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", phone=").append(phone);
        sb.append(", nickname=").append(nickname);
        sb.append(", introduction=").append(introduction);
        sb.append(", location=").append(location);
        sb.append(", height=").append(height);
        sb.append(", weight=").append(weight);
        sb.append(", birthday=").append(birthday);
        sb.append(", roleType=").append(roleType);
        sb.append(", industry=").append(industry);
        sb.append(", emotionStatus=").append(emotionStatus);
        sb.append(", mbti=").append(mbti);
        sb.append(", datingPurpose=").append(datingPurpose);
        sb.append(", interests=").append(interests);
        sb.append(", sports=").append(sports);
        sb.append(", ipAddress=").append(ipAddress);
        sb.append(", isVerified=").append(isVerified);
        sb.append(", isDeleted=").append(isDeleted);
        sb.append(", deleteTime=").append(deleteTime);
        sb.append(", createdAt=").append(createdAt);
        sb.append(", updatedAt=").append(updatedAt);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}