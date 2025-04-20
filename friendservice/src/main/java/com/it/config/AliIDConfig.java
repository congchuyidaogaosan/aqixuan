package com.it.config;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.springframework.web.multipart.MultipartFile;

public class AliIDConfig {
    public static final String ALI_API_HOST = "https://cardnumber.market.alicloudapi.com";
    public static final String ALI_API_PATH = "/rest/160601/ocr/ocr_idcard.json";
    public static final String ALI_API_APPCODE = "58fdeb20140f4872aaea1f8be1011660";

    public static final String ALI_IDCHECK_HOST = "https://sxidcheck.market.alicloudapi.com";
    public static final String ALI_IDCHECK_PATH = "/idcard/check";

    public static Map<String, String> buildHeaders() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "APPCODE " + ALI_API_APPCODE);
        headers.put("Content-Type", "application/json; charset=UTF-8");
        return headers;
    }

    public static String imgBase64(MultipartFile file) {
        String imgBase64 = "";
        try {
            byte[] content = file.getBytes();
            imgBase64 = new String(Base64.encodeBase64(content));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return imgBase64;
    }
}
