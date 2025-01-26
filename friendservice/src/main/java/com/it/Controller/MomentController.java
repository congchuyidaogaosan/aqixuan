package com.it.Controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.domain.DTO.MomentDTO;
import com.it.domain.Follow;
import com.it.domain.Moment;
import com.it.domain.MomentLike;
import com.it.domain.MomentMedia;
import com.it.domain.common.Result;
import com.it.service.FollowService;
import com.it.service.MomentLikeService;
import com.it.service.MomentMediaService;
import com.it.service.MomentService;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("Moment")
public class MomentController {

    @Autowired
    private MomentService momentService;

    @Autowired
    private MomentMediaService momentMediaService;



    @Autowired
    private TokenUtil tokenUtil;

    @RequestMapping("list")
    public Result list(HttpServletRequest request) {

        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");

        List<MomentDTO> list = momentService.ListMomentDTO(userId,Integer.valueOf(userId));

        return Result.ok(list);

    }

    @GetMapping("find/{userId}")
    public Result find(@PathVariable("userId") Integer userId,HttpServletRequest request) {
        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String myuserId = stringStringMap.get("userId");
        // 第一个是根据这个userid查询动态列表，第二个是我的id 查询我是否对这条动态点赞了
        List<MomentDTO> list = momentService.ListMomentDTO(Integer.toString(userId),Integer.valueOf(myuserId));
        return Result.ok(list);

    }


    @GetMapping("detail/{id}")
    public Result detail(@PathVariable("id") Integer id, HttpServletRequest request) {

        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");

        List<MomentDTO> list = momentService.ListMomentDTOByID(Integer.toString(id),Integer.valueOf(userId));

        return Result.ok(list);

    }


    @PostMapping("save")
    public Result save(@RequestBody MomentDTO moment, HttpServletRequest request) {

        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");

        moment.setUserId(Integer.valueOf(userId));
        moment.setLikesCount(0);
        moment.setCommentsCount(0);

        boolean b = momentService.save(moment);

        for (MomentMedia media : moment.getList()) {
            media.setMomentId(moment.getId());
        }


        momentMediaService.saveBatch(moment.getList());

        return Result.ok("添加成功");
    }


    @PostMapping("update")
    public Result update(@RequestBody Moment moment) {

        boolean b = momentService.updateById(moment);
        Moment byId = momentService.getById(moment.getId());

        List<MomentMedia> moment_id = momentMediaService.list(new QueryWrapper<MomentMedia>().eq("moment_id", byId.getId()));
        MomentDTO momentDTO = new MomentDTO(byId, moment_id);

        return Result.ok(momentDTO);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = momentService.removeById(id);
        return Result.ok();
    }

}
