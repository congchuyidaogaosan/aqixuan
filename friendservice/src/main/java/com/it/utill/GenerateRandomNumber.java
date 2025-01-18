package com.it.utill;

import org.springframework.stereotype.Component;

import java.util.Random;

/**
 * 随机数字工具类
 */
@Component
public class GenerateRandomNumber {

    public String getRandoNumber(int num) {
        Random random = new Random();
        StringBuilder str = new StringBuilder();

        for (int i = 0; i < num; i++) {
            if (i == 0) {
// 首位不能为0，取值范围为[1, 9]
                str.append(random.nextInt(9) + 1);
            } else {
// 其余位的数字取值范围为[0, 9]
                str.append(random.nextInt(10));
            }
        }

//        System.out.println(str.toString());
        return str.toString();
    }

}