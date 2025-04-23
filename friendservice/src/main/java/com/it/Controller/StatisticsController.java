package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.it.domain.*;
import com.it.domain.common.Result;
import com.it.domain.common.ResultCodeEnum;
import com.it.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/manage/statistics")
public class StatisticsController {
    private static final Logger logger = LoggerFactory.getLogger(StatisticsController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private MomentService momentService;

    @Autowired
    private MomentCommentService commentService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private ActivitySignupService signupService;

    @GetMapping("/overview")
    public Result<Map<String, Object>> getOverview() {
        try {
            Map<String, Object> overview = new HashMap<>();
            
            // 获取今天的日期范围
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date todayStart = calendar.getTime();
            
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            Date todayEnd = calendar.getTime();
            
            // 获取今日新增用户数
            LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
            userWrapper.between(User::getCreatedAt, todayStart, todayEnd);
            long newUsers = userService.count(userWrapper);
            
            // 获取今日新增动态数
            LambdaQueryWrapper<Moment> momentWrapper = new LambdaQueryWrapper<>();
            momentWrapper.between(Moment::getCreatedAt, todayStart, todayEnd);
            long newPosts = momentService.count(momentWrapper);
            
            // 获取今日新增活动数
            LambdaQueryWrapper<Activity> activityWrapper = new LambdaQueryWrapper<>();
            activityWrapper.between(Activity::getCreatedAt, todayStart, todayEnd);
            long newActivities = activityService.count(activityWrapper);

            overview.put("newUsers", newUsers);
            overview.put("newPosts", newPosts);
            overview.put("newActivities", newActivities);

            return Result.<Map<String, Object>>build(overview, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("获取概览数据失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取概览数据失败");
        }
    }

    @GetMapping("/trends")
    public Result<Map<String, Object>> getTrends(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        try {
            List<Map<String, Object>> trends = new ArrayList<>();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date start = startDate != null ? sdf.parse(startDate) : null;
            Date end = endDate != null ? sdf.parse(endDate) : null;

            // 获取用户注册趋势
            LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
            if (start != null && end != null) {
                userWrapper.between(User::getCreatedAt, start, end);
            }
            List<User> users = userService.list(userWrapper);
            Map<String, Long> userTrends = users.stream()
                .collect(Collectors.groupingBy(
                    user -> sdf.format(user.getCreatedAt()),
                    Collectors.counting()
                ));

            // 获取动态发布趋势
            LambdaQueryWrapper<Moment> momentWrapper = new LambdaQueryWrapper<>();
            if (start != null && end != null) {
                momentWrapper.between(Moment::getCreatedAt, start, end);
            }
            List<Moment> moments = momentService.list(momentWrapper);
            Map<String, Long> postTrends = moments.stream()
                .collect(Collectors.groupingBy(
                    moment -> sdf.format(moment.getCreatedAt()),
                    Collectors.counting()
                ));

            // 获取活动创建趋势
            LambdaQueryWrapper<Activity> activityWrapper = new LambdaQueryWrapper<>();
            if (start != null && end != null) {
                activityWrapper.between(Activity::getCreatedAt, start, end);
            }
            List<Activity> activities = activityService.list(activityWrapper);
            Map<String, Long> activityTrends = activities.stream()
                .collect(Collectors.groupingBy(
                    activity -> sdf.format(activity.getCreatedAt()),
                    Collectors.counting()
                ));

            // 合并所有日期
            Set<String> allDates = new TreeSet<>();
            allDates.addAll(userTrends.keySet());
            allDates.addAll(postTrends.keySet());
            allDates.addAll(activityTrends.keySet());

            // 组装数据
            for (String date : allDates) {
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", date);
                dayData.put("users", userTrends.getOrDefault(date, 0L));
                dayData.put("posts", postTrends.getOrDefault(date, 0L));
                dayData.put("activities", activityTrends.getOrDefault(date, 0L));
                trends.add(dayData);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("trends", trends);

            return Result.<Map<String, Object>>build(result, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("获取趋势数据失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取趋势数据失败");
        }
    }

    @GetMapping("/activity-types")
    public Result<Map<String, Object>> getActivityTypes() {
        try {
            List<Map<String, Object>> typeStats = new ArrayList<>();
            
            // 获取所有活动
            List<Activity> activities = activityService.list();
            
            // 按类型分组统计
            Map<String, Long> typeCounts = activities.stream()
                .collect(Collectors.groupingBy(
                    Activity::getActivityType,
                    Collectors.counting()
                ));

            // 转换数据格式
            for (Map.Entry<String, Long> entry : typeCounts.entrySet()) {
                Map<String, Object> typeData = new HashMap<>();
                typeData.put("type", entry.getKey().equals("0") ? "户外活动" : "室内活动");
                typeData.put("value", entry.getValue());
                typeStats.add(typeData);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("types", typeStats);

            return Result.<Map<String, Object>>build(result, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("获取活动类型统计失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取活动类型统计失败");
        }
    }

    @GetMapping("/signup-stats")
    public Result<Map<String, Object>> getSignupStats() {
        try {
            List<Map<String, Object>> signupStats = new ArrayList<>();
            
            // 获取所有报名记录
            List<ActivitySignup> signups = signupService.list();
            
            // 按状态分组统计
            Map<Byte, Long> statusCounts = signups.stream()
                .collect(Collectors.groupingBy(
                    signup -> Byte.valueOf(signup.getStatus()),
                    Collectors.counting()
                ));

            // 转换数据格式
            Map<Byte, String> statusMap = new HashMap<>();
            statusMap.put((byte)1, "已参与");
            statusMap.put((byte)2, "已取消");
            statusMap.put((byte)3, "已完成");

            for (Map.Entry<Byte, Long> entry : statusCounts.entrySet()) {
                Map<String, Object> statusData = new HashMap<>();
                statusData.put("status", statusMap.getOrDefault(entry.getKey(), "未知"));
                statusData.put("value", entry.getValue());
                signupStats.add(statusData);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("signups", signupStats);

            return Result.<Map<String, Object>>build(result, ResultCodeEnum.SUCCESS);
        } catch (Exception e) {
            logger.error("获取报名统计失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取报名统计失败");
        }
    }

    @GetMapping("/activity-cost")
    public Result<Map<String, Object>> getActivityCostDistribution() {
        try {
            List<Map<String, Object>> costStats = new ArrayList<>();
            
            // 获取所有活动
            List<Activity> activities = activityService.list();
            
            // 按费用类型分组统计
            Map<String, List<Activity>> costGroups = activities.stream()
                .collect(Collectors.groupingBy(activity -> {
                    BigDecimal cost = activity.getCost();
                    if (cost == null || cost.compareTo(BigDecimal.ZERO) == 0) {
                        return "免费";
                    } else if (cost.compareTo(new BigDecimal("50")) <= 0) {
                        return "50元以下";
                    } else if (cost.compareTo(new BigDecimal("100")) <= 0) {
                        return "50-100元";
                    } else {
                        return "100元以上";
                    }
                }));

            // 转换为前端需要的格式
            costGroups.forEach((type, list) -> {
                Map<String, Object> stat = new HashMap<>();
                stat.put("type", type);
                stat.put("value", list.size());
                costStats.add(stat);
            });

            Map<String, Object> result = new HashMap<>();
            result.put("costStats", costStats);
            return Result.ok(result);
        } catch (Exception e) {
            logger.error("获取活动费用分布失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取活动费用分布失败");
        }
    }

    @GetMapping("/activity-types-today")
    public Result<Map<String, Object>> getTodayActivityTypes() {
        try {
            List<Map<String, Object>> typeStats = new ArrayList<>();
            
            // 获取今天的日期范围
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date todayStart = calendar.getTime();
            
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            Date todayEnd = calendar.getTime();
            
            // 查询今日活动
            LambdaQueryWrapper<Activity> wrapper = new LambdaQueryWrapper<>();
            wrapper.between(Activity::getCreatedAt, todayStart, todayEnd);
            List<Activity> todayActivities = activityService.list(wrapper);
            
            // 按类型分组统计
            Map<String, Long> typeGroups = todayActivities.stream()
                .collect(Collectors.groupingBy(
                    Activity::getActivityType,
                    Collectors.counting()
                ));

            // 转换为前端需要的格式
            typeGroups.forEach((type, count) -> {
                Map<String, Object> stat = new HashMap<>();
                stat.put("type", type);
                stat.put("value", count);
                typeStats.add(stat);
            });

            Map<String, Object> result = new HashMap<>();
            result.put("typeStats", typeStats);
            return Result.ok(result);
        } catch (Exception e) {
            logger.error("获取今日活动类型分布失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取今日活动类型分布失败");
        }
    }

    @GetMapping("/user-activity-heatmap")
    public Result<Map<String, Object>> getUserActivityHeatmap() {
        try {
            List<Map<String, Object>> heatmapData = new ArrayList<>();
            
            // 获取最近30天的数据
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, -30);
            Date startDate = calendar.getTime();
            
            // 查询用户活动数据（动态、评论、点赞）
            LambdaQueryWrapper<Moment> momentWrapper = new LambdaQueryWrapper<>();
            momentWrapper.ge(Moment::getCreatedAt, startDate);
            List<Moment> moments = momentService.list(momentWrapper);
            
            // 按小时统计活动次数
            Map<String, Integer> hourlyStats = new HashMap<>();
            SimpleDateFormat hourFormat = new SimpleDateFormat("HH");
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            
            moments.forEach(moment -> {
                String hour = hourFormat.format(moment.getCreatedAt());
                String date = dateFormat.format(moment.getCreatedAt());
                String key = date + "-" + hour;
                hourlyStats.merge(key, 1, Integer::sum);
            });
            
            // 转换为前端需要的格式
            hourlyStats.forEach((key, count) -> {
                String[] parts = key.split("-");
                Map<String, Object> data = new HashMap<>();
                data.put("date", parts[0] + "-" + parts[1] + "-" + parts[2]);
                data.put("hour", parts[3]);
                data.put("value", count);
                heatmapData.add(data);
            });

            Map<String, Object> result = new HashMap<>();
            result.put("heatmapData", heatmapData);
            return Result.ok(result);
        } catch (Exception e) {
            logger.error("获取用户活跃度热力图数据失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取用户活跃度热力图数据失败");
        }
    }

    @GetMapping("/activity-location-heatmap")
    public Result<Map<String, Object>> getActivityLocationHeatmap() {
        try {
            List<Map<String, Object>> locationData = new ArrayList<>();
            
            // 获取所有活动位置数据
            List<Activity> activities = activityService.list();
            
            // 统计每个位置的活动数量
            Map<String, Integer> locationStats = new HashMap<>();
            activities.forEach(activity -> {
                String location = activity.getLocation();
                String ip = activity.getIp(); // 格式: "经度,纬度"
                if (ip != null && !ip.isEmpty()) {
                    locationStats.merge(ip, 1, Integer::sum);
                }
            });
            
            // 转换为前端需要的格式
            locationStats.forEach((location, count) -> {
                String[] coordinates = location.split(",");
                if (coordinates.length == 2) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("lng", Double.parseDouble(coordinates[0]));
                    data.put("lat", Double.parseDouble(coordinates[1]));
                    data.put("count", count);
                    locationData.add(data);
                }
            });

            Map<String, Object> result = new HashMap<>();
            result.put("locationData", locationData);
            return Result.ok(result);
        } catch (Exception e) {
            logger.error("获取活动地点热力图数据失败", e);
            return Result.<Map<String, Object>>build(null, ResultCodeEnum.FAIL).message("获取活动地点热力图数据失败");
        }
    }
} 