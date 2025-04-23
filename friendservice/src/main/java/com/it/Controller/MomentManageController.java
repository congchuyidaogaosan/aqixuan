package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.*;
import com.it.service.*;
import com.it.domain.common.Result;
import com.it.domain.common.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/manage/moment")
public class MomentManageController {

    @Autowired
    private MomentService momentService;

    @Autowired
    private MomentMediaService momentMediaService;

    @Autowired
    private MomentCommentService momentCommentService;

    @Autowired
    private MomentLikeService momentLikeService;

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public Result<Map<String, Object>> getMomentList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String userNickname,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime,
            @RequestParam(required = false) Integer status
    ) {
        try {
            // 1. 根据用户昵称查找用户ID
            List<Integer> userIds = null;
            if (userNickname != null && !userNickname.trim().isEmpty()) {
                userIds = userService.list(new LambdaQueryWrapper<User>()
                        .like(User::getNickname, userNickname))
                        .stream()
                        .map(User::getId)
                        .collect(Collectors.toList());
                if (userIds.isEmpty()) {
                    Map<String, Object> emptyResult = new HashMap<>();
                    emptyResult.put("records", new ArrayList<>());
                    emptyResult.put("total", 0);
                    emptyResult.put("size", pageSize);
                    emptyResult.put("current", pageNum);
                    return Result.<Map<String, Object>>build(emptyResult, ResultCodeEnum.SUCCESS);
                }
            }

            // 2. 构建动态查询条件
            LambdaQueryWrapper<Moment> wrapper = new LambdaQueryWrapper<>();
            if (keyword != null && !keyword.trim().isEmpty()) {
                wrapper.like(Moment::getContent, keyword);
            }
            if (userIds != null) {
                wrapper.in(Moment::getUserId, userIds);
            }
            if (startTime != null && endTime != null) {
                wrapper.between(Moment::getCreatedAt, startTime, endTime);
            }

            // 3. 分页查询动态
            Page<Moment> page = new Page<>(pageNum, pageSize);
            Page<Moment> momentPage = momentService.page(page, wrapper);

            // 4. 获取用户信息和媒体信息
            List<Moment> records = momentPage.getRecords();
            if (!records.isEmpty()) {
                // 获取所有动态的用户ID
                Set<Integer> momentUserIds = records.stream()
                        .map(Moment::getUserId)
                        .collect(Collectors.toSet());

                // 批量查询用户信息
                Map<Integer, User> userMap = userService.listByIds(momentUserIds)
                        .stream()
                        .collect(Collectors.toMap(User::getId, user -> user));

                // 获取所有动态ID
                List<Integer> momentIds = records.stream()
                        .map(Moment::getId)
                        .collect(Collectors.toList());

                // 批量查询媒体信息
                Map<Integer, List<MomentMedia>> mediaMap = momentMediaService.list(
                        new LambdaQueryWrapper<MomentMedia>()
                                .in(MomentMedia::getMomentId, momentIds)
                ).stream().collect(Collectors.groupingBy(MomentMedia::getMomentId));

                // 组装返回数据
                List<Map<String, Object>> resultList = records.stream().map(moment -> {
                    Map<String, Object> resultMap = new HashMap<>();
                    resultMap.put("moment", moment);
                    
                    // 添加用户信息
                    User user = userMap.get(moment.getUserId());
                    if (user != null) {
                        resultMap.put("userNickname", user.getNickname());
                        resultMap.put("userAvatar", user.getHandImg());
                    }
                    
                    // 添加媒体信息
                    List<MomentMedia> mediaList = mediaMap.getOrDefault(moment.getId(), new ArrayList<>());
                    resultMap.put("mediaList", mediaList);
                    
                    return resultMap;
                }).collect(Collectors.toList());

                Map<String, Object> result = new HashMap<>();
                result.put("records", resultList);
                result.put("total", momentPage.getTotal());
                result.put("size", momentPage.getSize());
                result.put("current", momentPage.getCurrent());
                return Result.<Map<String, Object>>build(result, ResultCodeEnum.SUCCESS);
            }

            Map<String, Object> emptyResult = new HashMap<>();
            emptyResult.put("records", new ArrayList<>());
            emptyResult.put("total", momentPage.getTotal());
            emptyResult.put("size", momentPage.getSize());
            emptyResult.put("current", momentPage.getCurrent());
            return Result.<Map<String, Object>>build(emptyResult, ResultCodeEnum.SUCCESS);

        } catch (Exception e) {
            e.printStackTrace();
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取动态列表失败");
        }
    }

    @PostMapping("/delete/{id}")
    public Result<Void> deleteMoment(@PathVariable Integer id) {
        try {
            // 1. 删除动态
            boolean removed = momentService.removeById(id);
            if (!removed) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("动态不存在");
            }

            // 2. 删除相关媒体
            momentMediaService.remove(new LambdaQueryWrapper<MomentMedia>()
                    .eq(MomentMedia::getMomentId, id));

            // 3. 删除相关评论
            momentCommentService.remove(new LambdaQueryWrapper<MomentComment>()
                    .eq(MomentComment::getMomentId, id));

            // 4. 删除相关点赞
            momentLikeService.remove(new LambdaQueryWrapper<MomentLike>()
                    .eq(MomentLike::getMomentId, id));

            return Result.<Void>build(null, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.<Void>build(null, ResultCodeEnum.FAIL).message("删除动态失败");
        }
    }

    @PostMapping("/batchDelete")
    public Result<Void> batchDeleteMoments(@RequestBody List<Integer> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("请选择要删除的动态");
            }

            // 1. 批量删除动态
            boolean removed = momentService.removeByIds(ids);
            if (!removed) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("删除失败");
            }

            // 2. 批量删除相关媒体
            momentMediaService.remove(new LambdaQueryWrapper<MomentMedia>()
                    .in(MomentMedia::getMomentId, ids));

            // 3. 批量删除相关评论
            momentCommentService.remove(new LambdaQueryWrapper<MomentComment>()
                    .in(MomentComment::getMomentId, ids));

            // 4. 批量删除相关点赞
            momentLikeService.remove(new LambdaQueryWrapper<MomentLike>()
                    .in(MomentLike::getMomentId, ids));

            return Result.<Void>build(null, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.<Void>build(null, ResultCodeEnum.FAIL).message("批量删除动态失败");
        }
    }

    @GetMapping("/comments/{momentId}")
    public Result<List<MomentComment>> getMomentComments(@PathVariable Integer momentId) {
        try {
            // 1. 获取评论列表
            List<MomentComment> comments = momentCommentService.list(
                new LambdaQueryWrapper<MomentComment>()
                    .eq(MomentComment::getMomentId, momentId)
                    .orderByDesc(MomentComment::getCreatedAt)
            );

            // 2. 如果没有评论，直接返回空列表
            if (comments.isEmpty()) {
                return Result.<List<MomentComment>>build(new ArrayList<>(), ResultCodeEnum.SUCCESS);
            }

            // 3. 获取所有评论用户的ID
            Set<Integer> userIds = comments.stream()
                    .map(MomentComment::getUserId)
                    .collect(Collectors.toSet());

            // 4. 批量查询用户信息
            Map<Integer, User> userMap = userService.listByIds(userIds)
                    .stream()
                    .collect(Collectors.toMap(User::getId, user -> user));

            // 5. 填充用户信息
            comments.forEach(comment -> {
                User user = userMap.get(comment.getUserId());
                if (user != null) {
                    comment.setNickname(user.getNickname());
                    comment.setHandImg(user.getHandImg());
                }
            });

            return Result.<List<MomentComment>>build(comments, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.<List<MomentComment>>build(null, ResultCodeEnum.FAIL).message("获取评论列表失败");
        }
    }

    @PostMapping("/comment/delete/{id}")
    public Result<Void> deleteComment(@PathVariable Integer id) {
        try {
            // 1. 获取评论信息
            MomentComment comment = momentCommentService.getById(id);
            if (comment == null) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("评论不存在");
            }

            // 2. 删除评论
            boolean removed = momentCommentService.removeById(id);
            if (!removed) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("删除评论失败");
            }

            // 3. 删除子评论
            momentCommentService.remove(new LambdaQueryWrapper<MomentComment>()
                    .eq(MomentComment::getParentId, id));

            // 4. 更新动态的评论数
            Moment moment = momentService.getById(comment.getMomentId());
            if (moment != null) {
                // 重新计算评论数
                long commentCount = momentCommentService.count(new LambdaQueryWrapper<MomentComment>()
                        .eq(MomentComment::getMomentId, moment.getId()));
                moment.setCommentsCount((int) commentCount);
                momentService.updateById(moment);
            }

            return Result.<Void>build(null, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.<Void>build(null, ResultCodeEnum.FAIL).message("删除评论失败");
        }
    }
} 