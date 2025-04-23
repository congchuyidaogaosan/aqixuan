package com.it.Controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.it.domain.ChatMessage;
import com.it.domain.User;
import com.it.domain.common.Result;
import com.it.service.ChatMessageService;
import com.it.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/manage/message")
public class ChatMessageManageController {

    @Autowired
    private ChatMessageService chatMessageService;
    
    @Autowired
    private UserService userService;

    @GetMapping("list")
    public Result list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String senderId,
            @RequestParam(required = false) String receiverId,
            @RequestParam(required = false) String messageType,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime
    ) {
        Page<ChatMessage> page = new Page<>(current, pageSize);
        QueryWrapper<ChatMessage> queryWrapper = new QueryWrapper<>();
        
        // 添加搜索条件
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("content", keyword);
        }
        
        if (senderId != null && !senderId.trim().isEmpty()) {
            queryWrapper.eq("sender_id", senderId);
        }
        
        if (receiverId != null && !receiverId.trim().isEmpty()) {
            queryWrapper.eq("receiver_id", receiverId);
        }
        
        if (messageType != null && !messageType.trim().isEmpty()) {
            queryWrapper.eq("message_type", messageType);
        }
        
        if (startTime != null && !startTime.trim().isEmpty()) {
            queryWrapper.ge("created_at", startTime);
        }
        
        if (endTime != null && !endTime.trim().isEmpty()) {
            queryWrapper.le("created_at", endTime);
        }
        
        // 按时间倒序排序
        queryWrapper.orderByDesc("created_at");
        
        // 获取消息列表
        Page<ChatMessage> messagePage = chatMessageService.page(page, queryWrapper);
        return Result.ok(messagePage);
    }

    @GetMapping("detail/{id}")
    public Result detail(@PathVariable("id") Long id) {
        ChatMessage message = chatMessageService.getById(id);
        if (message == null) {
            return Result.fail("消息不存在");
        }
        return Result.ok(message);
    }

    @PostMapping("delete/{id}")
    public Result delete(@PathVariable("id") Long id) {
        boolean success = chatMessageService.removeById(id);
        if (success) {
            return Result.ok();
        }
        return Result.fail("删除消息失败");
    }

    @PostMapping("batchDelete")
    public Result batchDelete(@RequestBody List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Result.fail("消息ID列表不能为空");
        }
        
        boolean success = chatMessageService.removeByIds(ids);
        if (success) {
            return Result.ok();
        }
        return Result.fail("批量删除消息失败");
    }

    @GetMapping("listWithUser")
    public Result listWithUser(
            @RequestParam(value = "pageNum", defaultValue = "1") Integer current,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String senderNickname,
            @RequestParam(required = false) String receiverNickname,
            @RequestParam(required = false) String messageType,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime
    ) {
        try {
            // 获取消息列表
            Page<ChatMessage> page = new Page<>(current, pageSize);
            QueryWrapper<ChatMessage> queryWrapper = new QueryWrapper<>();
            
            // 添加搜索条件
            if (keyword != null && !keyword.trim().isEmpty()) {
                queryWrapper.like("content", keyword);
            }
            
            // 如果有发送者昵称，先查找对应的用户ID
            if (senderNickname != null && !senderNickname.trim().isEmpty()) {
                QueryWrapper<User> senderQuery = new QueryWrapper<>();
                senderQuery.like("nickname", senderNickname)
                         .or()
                         .like("id", senderNickname); // 同时支持ID搜索
                List<User> senders = userService.list(senderQuery);
                if (!senders.isEmpty()) {
                    queryWrapper.in("sender_id", senders.stream()
                        .map(user -> user.getId().toString())
                        .collect(Collectors.toList()));
                } else {
                    // 如果没找到匹配的用户，添加一个不可能的条件
                    queryWrapper.eq("sender_id", "-1");
                }
            }
            
            // 如果有接收者昵称，先查找对应的用户ID
            if (receiverNickname != null && !receiverNickname.trim().isEmpty()) {
                QueryWrapper<User> receiverQuery = new QueryWrapper<>();
                receiverQuery.like("nickname", receiverNickname)
                           .or()
                           .like("id", receiverNickname); // 同时支持ID搜索
                List<User> receivers = userService.list(receiverQuery);
                if (!receivers.isEmpty()) {
                    queryWrapper.in("receiver_id", receivers.stream()
                        .map(user -> user.getId().toString())
                        .collect(Collectors.toList()));
                } else {
                    // 如果没找到匹配的用户，添加一个不可能的条件
                    queryWrapper.eq("receiver_id", "-1");
                }
            }
            
            if (messageType != null && !messageType.trim().isEmpty()) {
                queryWrapper.eq("message_type", messageType);
            }
            
            if (startTime != null && !startTime.trim().isEmpty()) {
                queryWrapper.ge("created_at", startTime);
            }
            
            if (endTime != null && !endTime.trim().isEmpty()) {
                queryWrapper.le("created_at", endTime);
            }
            
            // 按时间倒序排序
            queryWrapper.orderByDesc("created_at");
            
            // 获取消息列表
            Page<ChatMessage> messagePage = chatMessageService.page(page, queryWrapper);
            List<ChatMessage> messages = messagePage.getRecords();

            // 收集所有用户ID
            Set<Integer> userIds = new HashSet<>();
            messages.forEach(msg -> {
                if (msg.getSenderId() != null) {
                    try {
                        userIds.add(Integer.parseInt(msg.getSenderId()));
                    } catch (NumberFormatException e) {
                        // 忽略无效的用户ID
                    }
                }
                if (msg.getReceiverId() != null) {
                    try {
                        userIds.add(Integer.parseInt(msg.getReceiverId()));
                    } catch (NumberFormatException e) {
                        // 忽略无效的用户ID
                    }
                }
            });

            // 批量获取用户信息
            final Map<Integer, User> userMap;
            if (!userIds.isEmpty()) {
                List<User> users = userService.listByIds(userIds);
                userMap = users.stream()
                    .collect(Collectors.toMap(
                        User::getId,
                        user -> user,
                        (existing, replacement) -> existing
                    ));
            } else {
                userMap = new HashMap<>();
            }

            // 为每条消息添加用户信息
            List<Map<String, Object>> messageWithUsers = messages.stream().map(msg -> {
                Map<String, Object> messageMap = new HashMap<>();
                messageMap.put("id", msg.getId());
                messageMap.put("senderId", msg.getSenderId());
                messageMap.put("receiverId", msg.getReceiverId());
                messageMap.put("messageType", msg.getMessageType());
                messageMap.put("content", msg.getContent());
                messageMap.put("isRead", msg.getIsRead());
                messageMap.put("createdAt", msg.getCreatedAt());

                // 添加发送者信息
                try {
                    Integer senderIdInt = Integer.parseInt(msg.getSenderId());
                    User sender = userMap.get(senderIdInt);
                    if (sender != null) {
                        messageMap.put("senderNickname", sender.getNickname());
                        messageMap.put("senderAvatar", sender.getHandImg());
                    }
                } catch (NumberFormatException e) {
                    // 处理ID转换异常
                }

                // 添加接收者信息
                try {
                    Integer receiverIdInt = Integer.parseInt(msg.getReceiverId());
                    User receiver = userMap.get(receiverIdInt);
                    if (receiver != null) {
                        messageMap.put("receiverNickname", receiver.getNickname());
                        messageMap.put("receiverAvatar", receiver.getHandImg());
                    }
                } catch (NumberFormatException e) {
                    // 处理ID转换异常
                }

                return messageMap;
            }).collect(Collectors.toList());

            // 构建返回结果
            Map<String, Object> result = new HashMap<>();
            result.put("records", messageWithUsers);
            result.put("total", messagePage.getTotal());
            result.put("size", messagePage.getSize());
            result.put("current", messagePage.getCurrent());
            result.put("pages", messagePage.getPages());

            return Result.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail("获取消息列表失败：" + e.getMessage());
        }
    }
} 