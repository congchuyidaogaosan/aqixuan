package com.it.Controller;

import com.it.domain.Blacklist;
import com.it.domain.UserPrivacy;
import com.it.domain.common.Result;
import com.it.service.BlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("BlackList")
@RestController()
public class BlackListController {


    @Autowired
    private BlacklistService blacklistService;


    @RequestMapping("list")
    public Result list(@RequestBody Blacklist blacklist) {

        List<Blacklist> list = blacklistService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        Blacklist byId = blacklistService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody Blacklist blacklist) {

        boolean b = blacklistService.save(blacklist);
        Blacklist byId = blacklistService.getById(blacklist.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody Blacklist blacklist) {

        boolean b = blacklistService.updateById(blacklist);
        Blacklist byId = blacklistService.getById(blacklist.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = blacklistService.removeById(id);
        return Result.ok();
    }


}
