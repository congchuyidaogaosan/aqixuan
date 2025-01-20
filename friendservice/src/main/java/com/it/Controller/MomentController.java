package com.it.Controller;


import com.it.domain.Follow;
import com.it.domain.Moment;
import com.it.domain.common.Result;
import com.it.service.FollowService;
import com.it.service.MomentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("Moment")
@RestController()
public class MomentController {

    @Autowired
    private MomentService momentService;

    @RequestMapping("list")
    public Result list(@RequestBody Moment moment) {

        List<Moment> list = momentService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        Moment byId = momentService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody Moment moment) {

        boolean b = momentService.save(moment);
        Moment byId = momentService.getById(moment.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody Moment moment) {

        boolean b = momentService.updateById(moment);
        Moment byId = momentService.getById(moment.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = momentService.removeById(id);
        return Result.ok();
    }

}
