package com.it.Controller;

import com.it.domain.common.Result;
import com.it.service.UserService;
import com.it.utill.SmsSendUtill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("phone")
public class PhoneController {

    @Autowired
    private UserService userService;

    @Autowired
    private SmsSendUtill smsSendUtill;


    @GetMapping("getPhone")
    public Result getPhone(@RequestParam("phone") String phone, @RequestParam(defaultValue = "", name = "isFlag") String isFlag) {

        Boolean flag = userService.isUserPhone(phone);

        if (!flag) {
//            return Result.fail("手机号不存在请注册");
            Result result = infoPhone(phone);

        }


        if (isFlag.equals("1160")) {
            //不发
            return smsSendUtill.NewGoDuanXin(phone);
        } else {
            //发
            return smsSendUtill.goDuanXin(phone);

        }

    }

    @GetMapping("isPhone")
    public Result isPhone(@RequestParam("phone") String phone, @RequestParam("code") String code, @RequestParam("key") String key) {

        Boolean flag = userService.isUserPhone(phone);
        if (!flag) {
            return Result.fail("手机号不存在请注册");
        }

        Result<?> duanXin = smsSendUtill.isDuanXin(phone, code, key);
        return duanXin;


    }

    @GetMapping("infoPhone")
    public Result infoPhone(@RequestParam("phone") String phone) {
        Result result = userService.infoUserPhone(phone);
        return result;
    }

}
