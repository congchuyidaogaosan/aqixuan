package com.it.domain.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class PhoneReturn {

    private String phone;
        private String code;
    private String key;
    private Date infoDate;


}
