package com.it.Controller.img;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("file")
public class ImageManagementController {
//http://localhost:90001/api/ImageMenagent/DelImage?str=ec3fe.jpg
    @Autowired
    private ImageUtil imageUtil;


    @PostMapping("/upload")
    public ResultEntity<Object> addImage(@RequestParam("file") MultipartFile file) {

        ResultEntity<Object> stringResultEntity = imageUtil.outputImage(file, 1);
        System.out.println(stringResultEntity.toString());
        return stringResultEntity;
    }


    @GetMapping("/DelImage")
    public ResultEntity DelImage(String str) {
        return imageUtil.DeleteById(str);
    }
}
