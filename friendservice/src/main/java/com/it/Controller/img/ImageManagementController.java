package com.it.Controller.img;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("file")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ImageManagementController {
//http://localhost:90001/api/ImageMenagent/DelImage?str=ec3fe.jpg
    @Autowired
    private ImageUtil imageUtil;


    @PostMapping("/upload")
    public ResultEntity<Object> addImage(@RequestParam("file") MultipartFile file) {
        try {
            // 检查文件是否为空
            if (file == null || file.isEmpty()) {
                System.out.println("文件为空");
                return ResultEntity.failed("文件为空");
            }


            // 处理文件上传
            System.out.println("开始处理文件上传");
            ResultEntity<Object> stringResultEntity = imageUtil.outputImage(file, 1);
            System.out.println("文件上传结果: " + stringResultEntity);
            return stringResultEntity;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("文件上传失败: " + e.getMessage());
            return ResultEntity.failed("文件上传失败：" + e.getMessage());
        }
    }


    @GetMapping("/DelImage")
    public ResultEntity DelImage(String str) {
        return imageUtil.DeleteById(str);
    }
}
