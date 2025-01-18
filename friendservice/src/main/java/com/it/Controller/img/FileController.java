package com.it.Controller.img;




import com.it.domain.common.Result;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

/**
 * 上传文件映射表
 */
@RestController
@RequestMapping("file")
@SuppressWarnings({"unchecked", "rawtypes"})
public class FileController {
    //	file/upload

//    /file/Adminupload
    /**
     * 上传文件
     * @return
     */
    @RequestMapping("/Adminupload")
    public Result Adminupload(@RequestParam("file") MultipartFile file) throws Exception {
        if (file.isEmpty()) {

        }

        String userDir = System.getProperty("user.dir");

        String name = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String type = file.getOriginalFilename().
                substring(file.getOriginalFilename().lastIndexOf('.'));
        String value = "\\src\\main\\resources\\image\\";
        String valueClass = "\\target\\classes\\image\\";

        InputStream in = file.getInputStream();
        FileOutputStream out = new FileOutputStream(userDir + value + name + type);
        for(int c=0;(c=in.read())!=-1;){
            out.write(c);
        }

        FileOutputStream out2 = new FileOutputStream(userDir + valueClass + name + type);
        InputStream in2 = file.getInputStream();

        try {
            for(int c=0;(c=in2.read())!=-1;){
                out2.write(c);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String str = "http://localhost:8081/" + "image\\" + name + type;
        return Result.ok(str);
    }


    /**
     * 上传文件
     * @return
     */
    @RequestMapping("/upload")
    public Result upload(@RequestParam("avatar") MultipartFile file) throws Exception {
        if (file.isEmpty()) {

        }

        String userDir = System.getProperty("user.dir");

        String name = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String type = file.getOriginalFilename().
                substring(file.getOriginalFilename().lastIndexOf('.'));
        String value = "\\src\\main\\resources\\image\\";
        String valueClass = "\\target\\classes\\image\\";

        InputStream in = file.getInputStream();
        FileOutputStream out = new FileOutputStream(userDir + value + name + type);
        for(int c=0;(c=in.read())!=-1;){
            out.write(c);
        }

        FileOutputStream out2 = new FileOutputStream(userDir + valueClass + name + type);
        InputStream in2 = file.getInputStream();

        try {
            for(int c=0;(c=in2.read())!=-1;){
                out2.write(c);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String str = "http://localhost:8081/" + "image\\" + name + type;
        return Result.ok(str);
    }



}
