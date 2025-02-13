
package com.it.domain.ws;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
public class Message {

    private Boolean system;

    private String fromName;

    private Set<String> message;

    public String getMessage(Boolean system,String fromName,Set<String> message) {
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("system",system);
        hashMap.put("fromName",fromName);
        hashMap.put("message",message);
        String s = new JSONObject(hashMap).toJSONString();
        return s;
    }

    // getter和setter方法
}
