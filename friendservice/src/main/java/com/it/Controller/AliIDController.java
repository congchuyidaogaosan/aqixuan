package com.it.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import com.it.config.AliIDConfig;
import com.it.utill.HttpUtils;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AliIDController {
    @PostMapping(value = "/ocr/idcard", consumes = "multipart/form-data")
    public JSONObject ocrIdCard(@RequestParam("file") MultipartFile file) {
        JSONObject result = new JSONObject();

        if (file.isEmpty()) {
            result.put("error", "请选择上传的文件");
            return result;
        }

        String imgBase64 = AliIDConfig.imgBase64(file);

        // configure配置
        JSONObject configObj = new JSONObject();
        configObj.put("side", "face");

        // 创建请求对象
        JSONObject requestObj = new JSONObject();
        requestObj.put("image", imgBase64);
        if (configObj.size() > 0) {
            requestObj.put("configure", configObj);
        }

        try {
            HttpResponse response =  HttpUtils.doPost(
                    AliIDConfig.ALI_API_HOST,
                    AliIDConfig.ALI_API_PATH,
                    "POST",
                    AliIDConfig.buildHeaders(),
                    new HashMap<>(),
                    requestObj.toJSONString() // 使用toJSONString()将JSONObject转换为字符串
            );

            int stat = response.getStatusLine().getStatusCode();
            if (stat != 200) {
                result.put("error", "Http code: " + stat);
                result.put("message", EntityUtils.toString(response.getEntity()));
            } else {
                String res = EntityUtils.toString(response.getEntity());
                result = JSON.parseObject(res);
            }
        } catch (Exception e) {
            result.put("error", "OCR API调用失败");
            result.put("message", e.getMessage());
            // 记录错误而不仅仅打印堆栈跟踪
            e.printStackTrace();
        }

        System.out.println(result);
        return checkIdcard(result.get("num"), result.get("name"));
    }

    public JSONObject checkIdcard(Object idcard, Object name) {
        JSONObject result = new JSONObject();

        Map<String, String> querys = new HashMap<>();
        querys.put("idCard", idcard.toString());
        querys.put("name", name.toString());

        try {
            HttpResponse response = HttpUtils.doPost(
                    AliIDConfig.ALI_IDCHECK_HOST,
                    AliIDConfig.ALI_IDCHECK_PATH,
                    "POST",
                    AliIDConfig.buildHeaders(),
                    querys,
                    new HashMap<>() // No need to pass an empty map for bodys
            );

            int stat = response.getStatusLine().getStatusCode();
            if (stat == 200) {
                String res = EntityUtils.toString(response.getEntity());
                result = JSON.parseObject(res);
            } else {
                result.put("error", "Http code: " + stat);
                result.put("message", EntityUtils.toString(response.getEntity()));
            }
        } catch (Exception e) {
            result.put("error", "实名认证检测失败");
            result.put("message", e.getMessage());
            // 记录错误而不仅仅打印堆栈跟踪
            e.printStackTrace();
        }

        System.out.println(result);
        return result;
    }
}
