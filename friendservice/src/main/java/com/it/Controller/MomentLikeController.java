package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.Moment;
import com.it.domain.MomentLike;
import com.it.domain.common.Result;
import com.it.service.MomentLikeService;
import com.it.service.MomentService;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;


@RequestMapping("MomentLike")
@RestController()
public class MomentLikeController {


    @Autowired
    private MomentLikeService momentLikeService;

    @Autowired
    private MomentService momentService;

    @Autowired
    private TokenUtil tokenUtil;

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

    @PostMapping("like")
    public Result like(@RequestBody MomentLike momentLike, HttpServletRequest request) {
        //获取当前登录用户
        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");
        momentLike.setUserId(Integer.parseInt(userId));
        boolean b = momentLikeService.save(momentLike);
        //根据momentID将动态点赞数+1
        Moment moment = momentService.getById(momentLike.getMomentId());
        moment.setLikesCount(moment.getLikesCount() + 1);
        momentService.updateById(moment);
        return Result.ok("点赞成功");
    }

    @PostMapping("unlike")
    public Result unlike(@RequestBody MomentLike momentLike, HttpServletRequest request) {
        //获取当前登录用户
        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");
        momentLike.setUserId(Integer.parseInt(userId));
        // 根据用户id和动态id删除点赞记录
        QueryWrapper<MomentLike> momentLikeQueryWrapper = new QueryWrapper<>();
        momentLikeQueryWrapper.eq("user_id", momentLike.getUserId());
        momentLikeQueryWrapper.eq("moment_id", momentLike.getMomentId());
        boolean b = momentLikeService.remove(momentLikeQueryWrapper);

        //根据momentID将动态点赞数-1
        Moment moment = momentService.getById(momentLike.getMomentId());
        moment.setLikesCount(moment.getLikesCount() - 1);
        momentService.updateById(moment);

        return Result.ok("取消点赞成功");
    }

}
