package com.it.Controller.img;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一整个项目中Ajax请求返回的结果(未来也可以用于分布式架构的各个模块间调用返回的同一类型)
 *
 * @param <T>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultEntity<T> {

    public static final String SUCCESS = "SUCCESS";
    public static final String FAILED = "FAILED";

    //用来封装当前请求处理的结果成功还是失败
    private String result;

    //请求处理失败的时候返回的错误消息
    private String message;

    //要返回的数据
    private T data;

    /**
     * 请求处理成功不需要返回数据时使用的返回
     *
     * @param <Type>
     * @return
     */
    public static <Type> ResultEntity<Type> successWithoutData() {
        return new ResultEntity<Type>(SUCCESS, null, null);
    }

    /**
     * 请求处理成功需要数据返回的方法
     *
     * @param data   要返回的数据
     * @param <Type>
     * @return
     */
    public static <Type> ResultEntity<Type> successWithData(Type data) {
        return new ResultEntity<Type>(SUCCESS, null, data);
    }

    /**
     * 请求处理成功需要数据返回的方法
     *
     * @param data   要返回的数据
     * @param <Type>
     * @return
     */
    public static <Type> ResultEntity<Type> successWithData(Type data, String message) {
        return new ResultEntity<Type>(SUCCESS, message, data);
    }

    /**
     * 请求处理失败后使用的工具方法
     *
     * @param message 失败的错误消息
     * @param <Type>
     * @return
     */
    public static <Type> ResultEntity<Type> failed(String message) {
        return new ResultEntity<Type>(FAILED, message, null);
    }

}
