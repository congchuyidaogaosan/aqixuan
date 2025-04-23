package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.UserAvatar;
import com.it.domain.MomentMedia;
import com.it.domain.Activity;
import com.it.domain.common.Result;
import com.it.domain.common.ResultCodeEnum;
import com.it.service.UserAvatarService;
import com.it.service.MomentMediaService;
import com.it.service.ActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/manage/file")
public class FileManageController {
    private static final Logger logger = LoggerFactory.getLogger(FileManageController.class);

    @Autowired
    private UserAvatarService userAvatarService;

    @Autowired
    private MomentMediaService momentMediaService;

    @Autowired
    private ActivityService activityService;

    @GetMapping("/list")
    public Result<Map<String, Object>> getFileList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean status
    ) {
        try {
            List<Map<String, Object>> allFiles = new ArrayList<>();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            // 1. 获取用户头像文件
            if (type == null || type.equals("image")) {
                LambdaQueryWrapper<UserAvatar> avatarWrapper = new LambdaQueryWrapper<>();
                if (keyword != null) {
                    avatarWrapper.like(UserAvatar::getAvatarUrl, keyword);
                }
                List<UserAvatar> avatars = userAvatarService.list(avatarWrapper);
                for (UserAvatar avatar : avatars) {
                    Map<String, Object> fileInfo = new HashMap<>();
                    fileInfo.put("id", "avatar_" + avatar.getId());
                    fileInfo.put("filename", getFileNameFromUrl(avatar.getAvatarUrl()));
                    fileInfo.put("type", "image");
                    fileInfo.put("uploadTime", avatar.getCreatedAt());
                    fileInfo.put("url", avatar.getAvatarUrl());
                    fileInfo.put("status", true);
                    allFiles.add(fileInfo);
                }
            }

            // 2. 获取动态媒体文件
            if (type == null || type.equals("image") || type.equals("video")) {
                LambdaQueryWrapper<MomentMedia> mediaWrapper = new LambdaQueryWrapper<>();
                if (keyword != null) {
                    mediaWrapper.like(MomentMedia::getMediaUrl, keyword);
                }
                if (type != null) {
                    mediaWrapper.eq(MomentMedia::getMediaType, type.equals("image") ? "1" : "2");
                }
                List<MomentMedia> medias = momentMediaService.list(mediaWrapper);
                for (MomentMedia media : medias) {
                    Map<String, Object> fileInfo = new HashMap<>();
                    fileInfo.put("id", "media_" + media.getId());
                    fileInfo.put("filename", getFileNameFromUrl(media.getMediaUrl()));
                    fileInfo.put("type", media.getMediaType().equals("1") ? "image" : "video");
                    fileInfo.put("uploadTime", media.getCreatedAt());
                    fileInfo.put("url", media.getMediaUrl());
                    fileInfo.put("status", true);
                    allFiles.add(fileInfo);
                }
            }

            // 3. 获取活动图片
            if (type == null || type.equals("image")) {
                LambdaQueryWrapper<Activity> activityWrapper = new LambdaQueryWrapper<>();
                if (keyword != null) {
                    activityWrapper.like(Activity::getHandImg, keyword);
                }
                List<Activity> activities = activityService.list(activityWrapper);
                for (Activity activity : activities) {
                    if (activity.getHandImg() != null && !activity.getHandImg().isEmpty()) {
                        Map<String, Object> fileInfo = new HashMap<>();
                        fileInfo.put("id", "activity_" + activity.getId());
                        fileInfo.put("filename", getFileNameFromUrl(activity.getHandImg()));
                        fileInfo.put("type", "image");
                        fileInfo.put("uploadTime", activity.getCreatedAt());
                        fileInfo.put("url", activity.getHandImg());
                        fileInfo.put("status", true);
                        allFiles.add(fileInfo);
                    }
                }
            }

            // 4. 分页处理
            int total = allFiles.size();
            int start = (pageNum - 1) * pageSize;
            int end = Math.min(start + pageSize, total);
            List<Map<String, Object>> pagedFiles = allFiles.subList(start, end);

            Map<String, Object> result = new HashMap<>();
            result.put("records", pagedFiles);
            result.put("total", total);
            result.put("size", pageSize);
            result.put("current", pageNum);

            return Result.<Map<String, Object>>build(result, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("获取文件列表失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取文件列表失败");
        }
    }

    @PostMapping("/delete/{id}")
    public Result<Void> deleteFile(@PathVariable String id) {
        try {
            String[] parts = id.split("_");
            if (parts.length != 2) {
                return Result.<Void>build(null, ResultCodeEnum.FAIL).message("无效的文件ID");
            }

            String type = parts[0];
            Integer fileId = Integer.parseInt(parts[1]);

            switch (type) {
                case "avatar":
                    userAvatarService.removeById(fileId);
                    break;
                case "media":
                    momentMediaService.removeById(fileId);
                    break;
                case "activity":
                    Activity activity = activityService.getById(fileId);
                    if (activity != null) {
                        activity.setHandImg(null);
                        activityService.updateById(activity);
                    }
                    break;
                default:
                    return Result.<Void>build(null, ResultCodeEnum.FAIL).message("未知的文件类型");
            }

            return Result.<Void>build(null, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("删除文件失败", e);
            return Result.<Void>build(null, ResultCodeEnum.FAIL).message("删除文件失败");
        }
    }

    @PostMapping("/batchDelete")
    public Result<Void> batchDeleteFiles(@RequestBody List<String> ids) {
        try {
            for (String id : ids) {
                deleteFile(id);
            }
            return Result.<Void>build(null, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("批量删除文件失败", e);
            return Result.<Void>build(null, ResultCodeEnum.FAIL).message("批量删除文件失败");
        }
    }

    private String getFileNameFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return "unknown";
        }
        String[] parts = url.split("/");
        return parts[parts.length - 1];
    }
} 