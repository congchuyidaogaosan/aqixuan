package com.it.Controller;


import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.service.UserService;
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

//        String token = request.getHeader("token");
//
//        String username = JwtHelper.getUsername(token);
//
//        Map<String, Object> map = rootService.getUserInfo(username);

        Map<String, Object> map = new HashMap<>();

        map.put("avatar", "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif");
        map.put("introduction", "I am a super administrator");
        map.put("name", "Super Admin");

        map.put("roles", "[admin]");

        return Result.ok(map);
    }

}
