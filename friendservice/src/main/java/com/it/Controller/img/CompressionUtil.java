package com.it.Controller.img;


import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.IOUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * 压缩工具类
 */
@Slf4j
public class CompressionUtil {

    /**
     * 压缩后的图片大小
     */
    private static final long AFTER_COMPRESSION_FILE_SIZE = 500L;

    /**
     * 方便通过文件流来给到thumbnailator的操作字节流
     * 传入stream然后转化为byte[]然后得到压缩后的数组
     */
    public static byte[] streamToBytesAndCompression(InputStream inputStream, Integer userId) throws IOException {
        //使用的是org.apache.commons.io.IOUtils
        byte[] bytes = IOUtils.toByteArray(inputStream);
        //图片小于500kb
        bytes = compressPicForScale(bytes, AFTER_COMPRESSION_FILE_SIZE, userId.toString());
        return bytes;
    }

    /**
     * 根据指定大小压缩图片
     *
     * @param imageBytes  源图片字节数组
     * @param desFileSize 指定图片大小，单位kb
     * @param imageId     影像编号
     * @return 压缩质量后的图片字节数组
     */
    public static byte[] compressPicForScale(byte[] imageBytes, long desFileSize, String imageId) {
        if (imageBytes == null || imageBytes.length <= 0 || imageBytes.length < desFileSize * 1024) {
            return imageBytes;
        }
        long srcSize = imageBytes.length;
        double accuracy = getAccuracy(srcSize / 1024);
        try {
            while (imageBytes.length > desFileSize * 1024) {
                ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes);
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream(imageBytes.length);
                Thumbnails.of(inputStream)
                        .scale(accuracy)
                        .outputQuality(accuracy)
                        .toOutputStream(outputStream);
                //图片压缩后的大小
                imageBytes = outputStream.toByteArray();
            }
            log.info("【图片压缩】imageId={} | 图片原大小={}kb | 压缩后大小={}kb",
                    imageId, srcSize / 1024, imageBytes.length / 1024);
        } catch (Exception e) {
            log.error("【图片压缩】msg=图片压缩失败!", e);
        }
        return imageBytes;
    }

    /**
     * 自动调节精度(经验数值)
     *
     * @param size 源图片大小
     * @return 图片压缩质量比
     */
    private static double getAccuracy(long size) {
        double accuracy;
        if (size < 900) {
            accuracy = 0.85;
        } else if (size < 2047) {
            accuracy = 0.6;
        } else if (size < 3275) {
            accuracy = 0.44;
        } else {
            accuracy = 0.4;
        }
        return accuracy;
    }
}
