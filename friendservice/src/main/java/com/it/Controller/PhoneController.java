package com.it.Controller;

import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.service.UserService;
import com.it.utill.SmsSendUtill;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("phone")
public class PhoneController {

    @Autowired
    private UserService userService;

    @Autowired
    private SmsSendUtill smsSendUtill;

    @Autowired
    private TokenUtil tokenUtil;

    @GetMapping("getPhone")
    public Result getPhone(@RequestParam("phone") String phone, @RequestParam(defaultValue = "", name = "isFlag") String isFlag) {

        Boolean flag = userService.isUserPhone(phone);

        if (!flag) {
//            return Result.fail("手机号不存在请注册");
            Result result = infoPhone(phone);
//
        }


        if (isFlag.equals("1160")) {
            //不发
            return smsSendUtill.NewGoDuanXin(phone);
        } else {
            //发
            return smsSendUtill.goDuanXin(phone);

        }

    }

    //
    @GetMapping("isPhone")
    public Result<?> isPhone(@RequestParam("phone") String phone, @RequestParam("code") String code, @RequestParam("key") String key) {

        Boolean flag = userService.isUserPhone(phone);
        if (!flag) {
            return Result.fail("手机号不存在请注册");
        }
     try {
         HashMap<String, Object> stringObjectHashMap = new HashMap<>();
         Result<User> duanXin = smsSendUtill.isDuanXin(phone, code, key);
         User data = duanXin.getData();

         String token = tokenUtil.getToken(data.getId() + "", data.getNickname(), data.getPhone());

         stringObjectHashMap.put("token", token);
         stringObjectHashMap.put("userInfo", data);


         return Result.ok(stringObjectHashMap);
     }catch (Exception e){
         return Result.fail("用户信息异常！");
     }


    }

    @GetMapping("infoPhone")
    public Result infoPhone(@RequestParam("phone") String phone) {
        Result result = userService.infoUserPhone(phone);
        return result;
    }

}
