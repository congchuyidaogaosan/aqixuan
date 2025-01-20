package com.it.Controller;


import com.it.domain.Moment;
import com.it.domain.MomentComment;
import com.it.domain.common.Result;
import com.it.service.MomentCommentService;
import com.it.service.MomentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RequestMapping("MomentComment")
@RestController()
public class MomentCommentController {


    @Autowired
    private MomentCommentService momentCommentService;

    @RequestMapping("list")
    public Result list(@RequestBody MomentComment moment) {

        List<MomentComment> list = momentCommentService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        MomentComment byId = momentCommentService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody MomentComment momentComment) {

        boolean b = momentCommentService.save(momentComment);
        MomentComment byId = momentCommentService.getById(momentComment.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody MomentComment momentComment) {

        boolean b = momentCommentService.updateById(momentComment);
        MomentComment byId = momentCommentService.getById(momentComment.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = momentCommentService.removeById(id);
        return Result.ok();
    }
}
