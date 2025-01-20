package com.it.Controller;

import com.it.domain.ChatMessage;
import com.it.domain.Follow;
import com.it.domain.common.Result;
import com.it.service.ChatMessageService;
import com.it.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;


@RestController
@RequestMapping("ChatMessage")
public class ChatMessageController {


    @Autowired
    private ChatMessageService chatMessageService;

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
