package com.it.Controller;

import com.it.domain.Follow;
import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.service.FollowService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("Follow")
@RestController
public class FollowController {
    @Autowired
    private FollowService followService;

    @RequestMapping("list")
    public Result list(@RequestBody Follow follow) {

        List<Follow> list = followService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {


        Follow byId = followService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("update")
    public Result update(@RequestBody Follow follow) {

        boolean b = followService.updateById(follow);
        Follow byId = followService.getById(follow.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = followService.removeById(id);
        return Result.ok();
    }

}
