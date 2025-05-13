package com.it.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import com.it.config.AliIDConfig;
import com.it.domain.DTO.IdentityCardDTO;
import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.service.UserService;
import com.it.utill.HttpUtils;
import com.it.utill.TokenUtil;
import com.it.utill.id2demo;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("code")
public class AliIDController {

    @Autowired
    private id2demo id2demo;

    @Autowired
    private UserService userService;

    @Autowired
    private TokenUtil tokenUtil;


    @GetMapping("yanzheng")
    public Result yanzheng(IdentityCardDTO identityCardDTO, @RequestHeader("token") String token) throws IOException {
        // 从token中获取用户ID
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");
        
        if (userId == null || userId.isEmpty()) {
            return Result.fail("用户未登录");
        }

        boolean b = id2demo.postData(identityCardDTO.getName(), identityCardDTO.getCode());
        if (b){
            // 认证成功，更新用户实名认证状态
            User user = new User();
            user.setIsVerified(1);
            user.setId(Integer.valueOf(userId));
            boolean updated = userService.updateById(user);
            
            if (updated) {
                // 获取更新后的用户信息返回
                User updatedUser = userService.getById(Integer.valueOf(userId));
                Map<String, Object> result = new HashMap<>();
                result.put("message", "实名认证成功");
                result.put("user", updatedUser);
                return Result.ok(result);
            } else {
                return Result.fail("更新用户认证状态失败");
            }
        } else {
            return Result.fail("实名认证验证失败");
        }
    }





}
