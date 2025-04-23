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
    public Result yanzheng(IdentityCardDTO identityCardDTO) throws IOException {


        boolean b = id2demo.postData(identityCardDTO.getName(), identityCardDTO.getCode());
        if (b){

            User user = new User();
            user.setIsVerified(true);
            // 用户ID
//            user.setId();
//            userService.updateById(user);
        return Result.ok();

        }else {
            return Result.fail();
        }



    }





}
