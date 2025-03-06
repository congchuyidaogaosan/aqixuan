package com.it.Controller.ws;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.it.Controller.UserAvatarController;
import com.it.domain.ChatMessage;
import com.it.domain.DTO.ChatMessageDTO;
import com.it.domain.DTO.UserInfoDTO;
import com.it.domain.Follow;
import com.it.domain.User;
import com.it.domain.UserAvatar;
import com.it.domain.common.Result;
import com.it.service.ChatMessageService;
import com.it.service.FollowService;
import com.it.service.UserAvatarService;
import com.it.utill.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("ChatMessage")
public class ChatMessageController {


    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private TokenUtil tokenUtil;

    @Autowired
    private UserAvatarController userAvatarService;

    @RequestMapping("list")
    public Result list(@RequestBody ChatMessage chatMessage) {

        List<ChatMessage> list = chatMessageService.list();
        return Result.ok(list);

    }

    @GetMapping("find/{id}")
    public Result find(@PathVariable("id") Integer id, HttpSession session) {

        ChatMessage byId = chatMessageService.getById(id);
        return Result.ok(byId);
    }

    @GetMapping("userID")
    public Result userID(
            HttpServletRequest request,
            @RequestParam(value = "size",defaultValue = "10")Integer size,
            @RequestParam(value = "page",defaultValue = "1")Integer page) {

        String token = request.getHeader("token");
//        Map<String, String> stringStringMap = tokenUtil.parseToken(token);
        //我的ID
//        String userId = stringStringMap.get("userId");
        String userId= "1";
        QueryWrapper<ChatMessage> queryWrapper = new QueryWrapper<>();

        queryWrapper.eq("sender_id",userId)
                .or().eq("receiver_id",userId).groupBy("receiver_id")
                .select("MAX(id) listId");

        List<Object > list = chatMessageService.listObjs(queryWrapper);

        if (list.isEmpty()){
            return Result.ok();
        }

        List<String> list1 = new ArrayList<>();

        for (Object strint:list){
            list1.add(strint.toString());
        }

        List<ChatMessage> chatMessages = chatMessageService.listByIds(list1);

        HashMap<String, ChatMessageDTO> hashMap = new HashMap<>();

        for (ChatMessage chatMessage:chatMessages){
            if (chatMessage.getSenderId().equals(userId)){
                Result<UserInfoDTO> userInfoDTOResult = userAvatarService.UserFind(Integer.valueOf(chatMessage.getReceiverId()), null);
                ChatMessageDTO chatMessageDTO = new ChatMessageDTO(userInfoDTOResult.getData(),chatMessage);
                hashMap.put(chatMessage.getSenderId()+":"+chatMessage.getReceiverId(),chatMessageDTO);
            }else if (chatMessage.getReceiverId().equals(userId)){
                Result<UserInfoDTO> userInfoDTOResult = userAvatarService.UserFind(Integer.valueOf(chatMessage.getSenderId()),null);
                ChatMessageDTO chatMessageDTO = new ChatMessageDTO(userInfoDTOResult.getData(),chatMessage);
                hashMap.put(chatMessage.getReceiverId()+":"+chatMessage.getSenderId(),chatMessageDTO);
            }
        }


        return Result.ok(hashMap.values());
    }




    @PostMapping("save")
    public Result save(@RequestBody ChatMessage chatMessage) {

        boolean b = chatMessageService.save(chatMessage);
        ChatMessage byId = chatMessageService.getById(chatMessage.getId());

        return Result.ok(byId);
    }


    @PostMapping("update")
    public Result update(@RequestBody ChatMessage follow) {

        boolean b = chatMessageService.updateById(follow);
        ChatMessage byId = chatMessageService.getById(follow.getId());

        return Result.ok(byId);
    }

    @GetMapping("delete/{id}")
    public Result delete(@PathVariable("id") Integer id) {
        boolean byId = chatMessageService.removeById(id);
        return Result.ok();
    }

}
