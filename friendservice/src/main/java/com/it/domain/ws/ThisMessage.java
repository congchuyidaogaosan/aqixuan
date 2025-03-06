package com.it.domain.ws;

import lombok.Data;

import java.util.Date;

@Data
public class ThisMessage {

    private Integer senderId;

    private Integer sendingId;

    private String handImg;

    private Date thisTime;

    private String Type;

    private String toName;
    private String message;
}
