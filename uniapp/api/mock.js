import Mock from 'mockjs'

// 设置拦截延迟
Mock.setup({
  timeout: '200-600'
})

// 定义通用的响应体格式
const success = (data, message = '成功') => {
  return {
    code: 200,
    message,
    data
  }
}

const error = (message = '失败', code = 500) => {
  return {
    code,
    message,
    data: null
  }
}

// 存储发送的验证码
const smsCache = new Map()

// 模拟验证码发送接口
Mock.mock(new RegExp('/api/sms/send'), 'post', options => {
  const { phone } = JSON.parse(options.body)
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return error('手机号格式错误')
  }
  const code = Mock.Random.integer(100000, 999999)
  // 保存验证码
  smsCache.set(phone, {
    code: code.toString(),
    expire: Date.now() + 300000 // 5分钟有效期
  })
  return success({
    phone,
    code, // 正式环境不应该返回验证码
    expire: 300
  }, '验证码发送成功')
})

// 模拟登录接口
Mock.mock(new RegExp('/api/user/login'), 'post', options => {
  const { phone, code, nickname } = JSON.parse(options.body)
  
  // 验证验证码
  const smsData = smsCache.get(phone)
  if (!smsData) {
    return error('请先获取验证码')
  }
  if (Date.now() > smsData.expire) {
    smsCache.delete(phone)
    return error('验证码已过期')
  }
  if (code !== smsData.code) {
    return error('验证码错误')
  }
  
  // 模拟检查是否为新用户
  const isNewUser = true
  if (isNewUser && !nickname) {
    return {
      code: 201,
      message: '新用户需要设置昵称',
      data: {
        needNickname: true,
        isNewUser: true
      }
    }
  }
  
  // 清除验证码缓存
  smsCache.delete(phone)
  
  return success({
    token: Mock.Random.guid(),
    userInfo: {
      id: Mock.Random.id(),
      phone,
    //   nickname: nickname || Mock.Random.cname(),
      avatar: Mock.Random.image('100x100', '#4A7BF7', 'Avatar'),
      gender: Mock.Random.integer(0, 2),
      createTime: Mock.Random.datetime()
    }
  }, '登录成功')
})

// 模拟更新昵称接口
Mock.mock(new RegExp('/api/user/update/nickname'), 'post', options => {
  const { nickname } = JSON.parse(options.body)
  if (!nickname?.trim()) {
    return error('昵称不能为空')
  }
  return success({
    nickname
  }, '设置成功')
})

// 导出mock数据模板
export const mockData = {
  userTemplate: {
    'id|+1': 1,
    'name': '@cname',
    'phone': /^1[3-9]\d{9}$/,
    'avatar': '@image("100x100")',
    'gender|0-2': 1,
    'createTime': '@datetime'
  }
} 