package com.it.Controller;


import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.service.UserService;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("Login")
public class LoginController {


    @Autowired
    private UserService userService;

    @Autowired
    private TokenUtil tokenUtil;

    //login
    @PostMapping("/login")
    public Result login(@RequestBody User root) {

//        User user = userService.getUserInfoByUserName(root.getUsername());
//
//        if (user == null) {
//            return Result.fail("用户不存在");
//        }
//
//        if (user.getPassword().equals(root.getPassword())) {
//            Map<String, Object> map = new HashMap<>();
//            map.put("token", "255252");
//            return Result.ok(map);
//        } else {
//            return Result.fail();
//        }

        return null;
    }

    //info
    @GetMapping("/info")
    public Result info(HttpServletRequest request) {

        String token = request.getHeader("token");

        Map<String, String> stringStringMap = tokenUtil.parseToken(token);

        return Result.ok(stringStringMap);
    }

    @GetMapping("/output")
    public Result output(HttpServletRequest request) {
        request.getSession().invalidate();

        return Result.ok();
    }
}
