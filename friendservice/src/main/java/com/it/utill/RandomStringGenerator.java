package com.it.utill;

import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * 随机字符串
 */
@Component
public class RandomStringGenerator {

    public String getSubString(int num) {
        String randomString = usingUUID();
//        System.out.println("Random string is: " + randomString);
        String substring = randomString.substring(0, num);
//        System.out.println("Random string of 8 characters is: " + substring);

        return substring;
    }

    private String usingUUID() {
        UUID randomUUID = UUID.randomUUID();
        return randomUUID.toString().replaceAll("-", "");
    }
}