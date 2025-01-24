package com.it.Controller;


import com.it.domain.DTO.MomentDTO;
import com.it.domain.Follow;
import com.it.domain.Moment;
import com.it.domain.MomentMedia;
import com.it.domain.common.Result;
import com.it.service.FollowService;
import com.it.service.MomentMediaService;
import com.it.service.MomentService;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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
    public Result list(@RequestBody Moment moment, HttpServletRequest request) {


        String token = request.getHeader("token");
        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        String userId = stringStringMap.get("userId");

        List<MomentDTO> list = momentService.ListMomentDTO(userId);
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        Moment byId = momentService.getById(id);
        return Result.ok(byId);

    }

    @PostMapping("save")
    public Result save(@RequestBody MomentDTO moment) {

        moment.setLikesCount(0);
        moment.setCommentsCount(0);

        boolean b = momentService.save(moment);
        Moment byId = momentService.getById(moment.getId());

        MomentMedia momentMedia = new MomentMedia();
        momentMedia.setMomentId(moment.getId());
        momentMedia.setMediaType(moment.getMediaType());
        momentMedia.setMediaUrl(moment.getMediaUrl());
        momentMediaService.save(momentMedia);

        return Result.ok("添加成功");
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
