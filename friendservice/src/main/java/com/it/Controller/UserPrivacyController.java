package com.it.Controller;


import com.it.domain.Follow;
import com.it.domain.UserPrivacy;
import com.it.domain.common.Result;
import com.it.service.FollowService;
import com.it.service.UserPrivacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;


@RestController
@RequestMapping("user")
public class UserPrivacyController {


    @Autowired
    private UserPrivacyService userPrivacyService;

    @RequestMapping("list")
    public Result list(@RequestBody UserPrivacy userPrivacy) {

        List<UserPrivacy> list = userPrivacyService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        UserPrivacy byId = userPrivacyService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody UserPrivacy userPrivacy) {

        boolean b = userPrivacyService.save(userPrivacy);
        UserPrivacy byId = userPrivacyService.getById(userPrivacy.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody UserPrivacy userPrivacy) {

        boolean b = userPrivacyService.updateById(userPrivacy);
        UserPrivacy byId = userPrivacyService.getById(userPrivacy.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = userPrivacyService.removeById(id);
        return Result.ok();
    }


}
