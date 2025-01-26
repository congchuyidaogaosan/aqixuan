package com.it.Controller;


import com.it.domain.Moment;
import com.it.domain.MomentComment;
import com.it.domain.common.Result;
import com.it.service.MomentCommentService;
import com.it.service.MomentService;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RequestMapping("MomentComment")
@RestController()
public class MomentCommentController {


    @Autowired
    private MomentCommentService momentCommentService;

    @Autowired
    private MomentService momentService;

    @Autowired
    private TokenUtil tokenUtil;


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
    public Result save(@RequestBody MomentComment momentComment, HttpServletRequest request) {
        //获取当前登录用户
        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");
        momentComment.setUserId(Integer.parseInt(userId));
        boolean b = momentCommentService.save(momentComment);
        //动态的评论数+1
        Moment moment = momentService.getById(momentComment.getMomentId());
        moment.setCommentsCount(moment.getCommentsCount() + 1);
        momentService.updateById(moment);
        return Result.ok("评论成功");
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
