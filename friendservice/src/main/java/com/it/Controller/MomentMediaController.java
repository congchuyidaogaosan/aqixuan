package com.it.Controller;


import com.it.domain.MomentLike;
import com.it.domain.MomentMedia;
import com.it.domain.common.Result;
import com.it.service.MomentLikeService;
import com.it.service.MomentMediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("MomentMedia")
@RestController()
public class MomentMediaController {


    @Autowired
    private MomentMediaService momentMediaService;

    @RequestMapping("list")
    public Result list(@RequestBody MomentLike momentLike) {

        List<MomentMedia> list = momentMediaService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        MomentMedia byId = momentMediaService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody MomentMedia momentMedia) {

        boolean b = momentMediaService.save(momentMedia);
        MomentMedia byId = momentMediaService.getById(momentMedia.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody MomentMedia momentMedia) {

        boolean b = momentMediaService.updateById(momentMedia);
        MomentMedia byId = momentMediaService.getById(momentMedia.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = momentMediaService.removeById(id);
        return Result.ok();
    }

}
