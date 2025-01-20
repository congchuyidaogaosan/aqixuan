package com.it.Controller;

import com.it.domain.Moment;
import com.it.domain.MomentLike;
import com.it.domain.common.Result;
import com.it.service.MomentLikeService;
import com.it.service.MomentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;


@RequestMapping("MomentLike")
@RestController()
public class MomentLikeController {


    @Autowired
    private MomentLikeService momentLikeService;

    @RequestMapping("list")
    public Result list(@RequestBody MomentLike momentLike) {

        List<MomentLike> list = momentLikeService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        MomentLike byId = momentLikeService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody MomentLike momentLike) {

        boolean b = momentLikeService.save(momentLike);
        MomentLike byId = momentLikeService.getById(momentLike.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody MomentLike momentLike) {

        boolean b = momentLikeService.updateById(momentLike);
        MomentLike byId = momentLikeService.getById(momentLike.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = momentLikeService.removeById(id);
        return Result.ok();
    }

}
