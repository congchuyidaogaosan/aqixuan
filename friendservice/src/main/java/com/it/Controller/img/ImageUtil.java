package com.it.Controller.img;



import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;
import java.util.Objects;
import java.util.UUID;

import static com.it.Controller.img.MultiparFileTransitionFile.MultipartFileToFile;


@Service
public class ImageUtil {

    private static final String url = "/upload/";

//    @Value("${upload.path}")
//    private String uploadPath;


    @Autowired
    private ServerProperties serverProperties;

    public ResultEntity outputImage(MultipartFile multipartFile, Integer num) {
        //处理上传的文件
        if (multipartFile != null) {
            //获取文件扩展名
            int index = multipartFile.getOriginalFilename().lastIndexOf(".");
            String exName = multipartFile.getOriginalFilename().substring(index);
            //随机生成文件名
            String uuid = UUID.randomUUID().toString().substring(0, 5);
            //将生成的uuid中的"-"去掉，并拼接扩展名
            String fileName = uuid.replace("-", "") + exName;

            return initLocation(num, fileName, multipartFile);


        }
        return ResultEntity.failed("参数上传错误");

    }

    private ResultEntity initLocation(Integer num, String fileName, MultipartFile multipartFile) {
        ResultEntity resultEntity = null;

        switch (num) {
            case 1:
                resultEntity = storageLocation(fileName, multipartFile);

                break;
        }

        if (resultEntity == null) {
            return ResultEntity.failed("传入参数错误");
        } else {
            return resultEntity;
        }


    }

    public ResultEntity<String> DeleteById(String IMG_PATH) {
        ApplicationHome h = new ApplicationHome(getClass());
        File jarF = h.getSource();
        String s1 = jarF.getParentFile().toString()+"/upload/";

        System.out.println("开始执行，图片路径为" + IMG_PATH);
        File file = new File(s1+IMG_PATH);
        //判断文件是否存在
        if (file.exists()) {
            System.out.println("图片存在，可执行删除操作");
            Boolean flag = false;
            flag = file.delete();
            if (flag) {
                System.out.println("成功删除图片" + file.getName());
                return ResultEntity.successWithData("成功删除图片");
            } else {

                return ResultEntity.failed("删除失败");
            }
        } else {

            return ResultEntity.failed("图片不存在，终止操作");
        }

    }

    public ResultEntity<String> storageLocation(String fileName, MultipartFile multipartFile) {

        try {

            String userId = "3";

            byte[] bytes = FileUtils.readFileToByteArray(Objects.requireNonNull(MultipartFileToFile(multipartFile)));
            bytes = CompressionUtil.compressPicForScale(bytes, 300, userId);




//            String str = "https://121.40.178.23:9002/image/" + fileName;
            String str = "http://8.134.184.96:9801/images/" + fileName;

            ApplicationHome applicationHome = new ApplicationHome(this.getClass());

            // 保存目录位置根据项目需求可随意更改
//            String s = "\\src\\main\\resources\\upload\\";
//            String s1 = applicationHome.getDir().getParentFile().getParentFile().getAbsolutePath() + s;

            ApplicationHome h = new ApplicationHome(getClass());
            File jarF = h.getSource();
            //在jar包所在目录下生成一个upload文件夹用来存储上传的图片
            String s1 = jarF.getParentFile().toString()+"/upload/";

//            String s1= "D:\\image\\";

            File savefile = new File(s1);
            if (!savefile.exists()) {
                savefile.mkdirs();
            }
//
            FileOutputStream fos = new FileOutputStream(s1 + fileName);
//            System.out.println("绝对 路径452521512512512");
//            String str = s1 + fileName;
//            String str = dirPath + fileName;

            fos.write(bytes);
            fos.close();



            return ResultEntity.successWithData(str);
        } catch (Exception e) {
            return ResultEntity.failed("图片上传错误" + e.getLocalizedMessage());
        }

    }


    public ResultEntity<byte[]> DeownloadHttp(String imageUrl) {

        String http = "http://";
        String https = "https://";
        InetAddress localhost;


        try {
            localhost = InetAddress.getLocalHost();
        } catch (Exception e) {
            return ResultEntity.failed("网络异常");
        }

        String IpPort = "121.40.178.23" + ":" + serverProperties.getPort();

//        String IpPort = "localhost" + ":" + serverProperties.getPort();

//        String MyImageUrl = http + IpPort + imageUrl;
        String MyImageUrl=imageUrl;
//
//        String MyImageUrl = "http://localhost:8083"+imageUrl;

        // 设置参数
        InputStream in = null;
        ByteArrayOutputStream byteArrOps = null;
        int length;
        byte[] buffer = new byte[1024 * 5];
        byte[] data = null;

        try {
            URL url = new URL(MyImageUrl);

            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("GET");
            urlConnection.setReadTimeout(1000 * 60);

            if (urlConnection.getResponseCode() == 200) {
                in = urlConnection.getInputStream();
                byteArrOps = new ByteArrayOutputStream();
                while ((length = in.read(buffer)) != -1) {
                    byteArrOps.write(buffer, 0, length);
                }
                byteArrOps.flush();
                data = byteArrOps.toByteArray();
                // 下载大小: data.length
            }

        } catch (Exception e) {
            return ResultEntity.failed(e.getMessage());
        } finally {
            try {
                if (byteArrOps != null) {
                    byteArrOps.close();
                }
                if (in != null) {
                    in.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return ResultEntity.successWithData(data);
    }


}
