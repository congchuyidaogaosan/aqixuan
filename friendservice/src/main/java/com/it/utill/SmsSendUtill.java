package com.it.utill;

import com.it.domain.DTO.PhoneReturn;
import com.it.domain.common.Result;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;


@Component
public class SmsSendUtill {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RandomStringGenerator randomStringGenerator;

    @Autowired
    private GenerateRandomNumber generateRandomNumber;


    public Result<?> NewGoDuanXin(@NotNull String phone) {

        String key = randomStringGenerator.getSubString(10);

        String randoNumber = generateRandomNumber.getRandoNumber(6);
        System.out.println("subString" + key + " ： randoNumber " + randoNumber);
        redisTemplate.opsForValue().set(key, randoNumber, 5, TimeUnit.MINUTES);


        PhoneReturn phoneReturn = new PhoneReturn();
        phoneReturn.setInfoDate(new Date());
        phoneReturn.setKey(key);
        phoneReturn.setPhone(phone);
        phoneReturn.setCode(randoNumber);

        return Result.ok(phoneReturn);

    }

    public Result<?> goDuanXin(@NotNull String phone) {

        String key = randomStringGenerator.getSubString(10);

        String randoNumber = generateRandomNumber.getRandoNumber(6);
        System.out.println("subString" + key + " ： randoNumber " + randoNumber);
        redisTemplate.opsForValue().set(key, randoNumber, 5, TimeUnit.MINUTES);

        String host = "https://gyytz.market.alicloudapi.com";
        String path = "/sms/smsSend";
        String method = "POST";
        String appcode = "3e124ed1766f4c10bdc78b2ffed293b7";
        Map<String, String> headers = new HashMap<String, String>();
        //最后在header中的格式(中间是英文空格)为Authorization:APPCODE 83359fd73fe94948385f570e3c139105
        headers.put("Authorization", "APPCODE " + appcode);
        Map<String, String> querys = new HashMap<String, String>();
        querys.put("mobile", phone);
        querys.put("param", "**code**:" + randoNumber + ",**minute**:5");

//smsSignId（短信前缀）和templateId（短信模板），可登录国阳云控制台自助申请。参考文档：http://help.guoyangyun.com/Problem/Qm.html
        querys.put("smsSignId", "2e65b1bb3d054466b82f0c9d125465e2");
        querys.put("templateId", "908e94ccf08b4476ba6c876d13f084ad");
        Map<String, String> bodys = new HashMap<String, String>();


        try {
            /**
             * 重要提示如下:
             * HttpUtils请从\r\n\t    \t* https://github.com/aliyun/api-gateway-demo-sign-java/blob/master/src/main/java/com/aliyun/api/gateway/demo/util/HttpUtils.java\r\n\t    \t* 下载
             * 相应的依赖请参照
             * https://github.com/aliyun/api-gateway-demo-sign-java/blob/master/pom.xml
             */
            HttpResponse httpResponse = HttpUtils.doPost(host, path, method, headers, querys, bodys);
            System.out.println(httpResponse.toString());
            //获取response的body
            System.out.println(EntityUtils.toString(httpResponse.getEntity()));


            PhoneReturn phoneReturn = new PhoneReturn();
            phoneReturn.setInfoDate(new Date());
            phoneReturn.setKey(key);
            phoneReturn.setPhone(phone);


            return Result.ok(phoneReturn);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail(e.toString());
        }


    }

    public Result<?> isDuanXin(@NotNull String phone, @NotNull String code, @NotNull String key) {

        String RedisCode = (String) redisTemplate.opsForValue().get(key);

        assert RedisCode != null;
        if (RedisCode.equals(code)) {
            return Result.ok();
        }

        return Result.fail();
    }


}
