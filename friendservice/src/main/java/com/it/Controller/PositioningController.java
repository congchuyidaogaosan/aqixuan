package com.it.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.it.domain.common.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/Positioning")
public class PositioningController {

    private final String key = "7cb90ca8ba111510553cb48f3fd57df9";

    @Autowired
    private RestTemplate restTemplate;


    /**
     *
     */
    @GetMapping("CalculateTwoPlaces")
    public Result CalculateTwoPlaces(
//            @RequestParam("APlaces") String APlaces, @RequestParam("BPlaces") String BPlaces
    ) {

        String url = "https://restapi.amap.com/v3/distance" +
                "?origins=116.481028,39.989643&destination=114.465302,40.004717&key=" + key;

        String result = restTemplate.getForObject(url, String.class);
        Object o = JSONObject.parseObject(result).getJSONArray("results").getJSONObject(0).get("distance");

//        jsonObject.getJSONObject()
//getJSONObject("results").getString("distance")


//        System.out.println(string);


        return Result.ok(o);
    }

    /**
     * 地址方法
     */
    @GetMapping("getTargeting")
    public Result getTargeting() {
        String url = "https://restapi.amap.com/v3/ip?output=xml&key=" + key;

        String result = restTemplate.getForObject(url, String.class);

        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);

        JSONObject jsonObject = convertXMLtoJSON(result);

        System.out.println(jsonObject);

        return Result.ok(jsonObject);
    }


    public static JSONObject convertXMLtoJSON(String xml) {
        // 使用简单的字符串处理来模拟XML解析
        // 注意：这里假设XML结构固定且简单，实际应用中应使用XML解析库（如JAXB或DOM解析器）
        JSONObject json = new JSONObject();

        // 手动解析XML标签
        json.put("status", extractValue(xml, "<status>", "</status>"));
        json.put("info", extractValue(xml, "<info>", "</info>"));
        json.put("infocode", extractValue(xml, "<infocode>", "</infocode>"));
        json.put("province", extractValue(xml, "<province>", "</province>"));
        json.put("city", extractValue(xml, "<city>", "</city>"));
        json.put("adcode", extractValue(xml, "<adcode>", "</adcode>"));
        json.put("rectangle", extractValue(xml, "<rectangle>", "</rectangle>"));

        return json;
    }

    public static String extractValue(String xml, String startTag, String endTag) {
        int start = xml.indexOf(startTag) + startTag.length();
        int end = xml.indexOf(endTag);
        return xml.substring(start, end);
    }

}
