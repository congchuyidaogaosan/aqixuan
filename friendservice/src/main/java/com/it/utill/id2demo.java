package com.it.utill;

import java.io.IOException;

import com.alibaba.fastjson.JSON;
import com.it.domain.common.Result;
import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.stereotype.Component;

@Component
public class id2demo {
	String appCode = "58fdeb20140f4872aaea1f8be1011660";
	String url = "https://idenauthen.market.alicloudapi.com/idenAuthentication";
	public  void main(String[] args) throws IOException {
        

        // 获取appCode链接：https://market.console.aliyun.com/

        String name = "孙嘉祺";
        String idNo = "230183200207011918";

//        System.out.println(postData(appCode, url, name, idNo));
	}
	
	/**依赖的工具包有：okhttp-3.2.0.jar, okio-1.14.0.jar
	 * 工具包下载链接：https://download.csdn.net/download/ruidongjun007/88360015
	 * <dependency>
     *      <groupId>com.squareup.okhttp3</groupId>
     *      <artifactId>okhttp</artifactId>
     *      <version>3.2.0</version>
     *  </dependency>
     *  
     *  <dependency>
	 *  	<groupId>com.squareup.okio</groupId>
	 *  	<artifactId>okio</artifactId>
	 *  	<version>1.14.0</version>
	 *  </dependency>
	 */
	public boolean postData(String name, String idNo) throws IOException {
		String result = "";
		RequestBody formBody = new FormBody.Builder().add("name", name).add("idNo", idNo).build();
		Request request = new Request.Builder().url(url).addHeader("Authorization", "APPCODE " + appCode).post(formBody).build();
		
		Call call = new OkHttpClient().newCall(request);
		Response response = null;
		try {
		    response = call.execute();
		} catch (IOException e) {
		    System.out.println("execute failed, message:" + e.getMessage());
		}
		
		assert response != null;
		if (!response.isSuccessful()) {      // 当返回结果发生错误时
		    // 状态码为403时一般是套餐包用尽，需续购；注意：续购不会改变秘钥（appCode），仅增加次数
		    // 续购链接：https://market.aliyun.com/products/57000002/cmapi025518.html
		    System.out.println("request failed----" + "返回状态码" + response.code()  + ",message:" + response.message());
		}
		result = response.body().string();    //此处不可以使用toString()方法，该方法已过期

		String respCode = JSON.parseObject(result).getString("respCode");
		if (respCode.equals("0000")){
			return true;
		}else {
			return false;
		}


	}
}