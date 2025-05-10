// 使用uni.uploadFile上传文件
const uploadFile = (res) => new Promise((resolve, reject) => {
    console.log('选择的文件信息:', res.tempFiles[0])
    uni.uploadFile({
      url: 'http://8.134.184.96:9801/file/upload',
      filePath: res.tempFiles[0].path,
      name: 'file',
      success: (res) => {
        console.log('上传响应:', res)
        if (res.statusCode === 200) {
          try {  
            const data = JSON.parse(res.data)
            console.log('上传响应数据:', data)
            resolve(data)
          } catch (e) {
            console.error('解析响应数据失败:', e)
            reject(new Error('解析响应数据失败'))
          }
        } else {
          console.log("upload 方法错误");
          reject(new Error('上传失败'))
        }
      },
      fail: (err) => {
      console.log("uniapp upload err");
        console.error('上传失败:', err)
        reject(err)
      }
    })
  })

export default uploadFile