class WebSocketManager {
  constructor() {
    // 根据环境设置WebSocket地址
    this.url = 'ws://localhost:8081/ws' 
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000 // 重连间隔时间，单位：毫秒
    this.messageCallbacks = new Map()
    
    // 开发环境下打印更多日志
    this.debug = process.env.NODE_ENV === 'development'
  }

  // 初始化WebSocket连接
  connect(token) {
    if (this.socket && this.isConnected) {
      this.debug && console.log('WebSocket已连接')
      return
    }

    try {
      this.debug && console.log('正在连接WebSocket:', this.url)
      this.socket = uni.connectSocket({
        url: `${this.url}?token=${token}`,
        complete: () => {}
      })

      // 监听WebSocket连接打开
      this.socket.onOpen(() => {
        this.debug && console.log('WebSocket连接已打开')
        this.isConnected = true
        this.reconnectAttempts = 0
      })

      // 监听WebSocket错误
      this.socket.onError((error) => {
        console.error('WebSocket错误：', error)
        this.isConnected = false
        this.reconnect()
      })

      // 监听WebSocket关闭
      this.socket.onClose(() => {
        this.debug && console.log('WebSocket连接已关闭')
        this.isConnected = false
        this.reconnect()
      })

      // 监听WebSocket消息
      this.socket.onMessage((res) => {
        try {
          const message = JSON.parse(res.data)
          this.debug && console.log('收到消息：', message)
          
          // 处理心跳消息
          if (message.type === 'heartbeat') {
            this.debug && console.log('收到心跳消息')
            return
          }
          
          // 处理其他消息
          this.handleMessage(message)
        } catch (error) {
          console.error('解析消息失败：', error)
        }
      })

    } catch (error) {
      console.error('创建WebSocket连接失败：', error)
      this.reconnect()
    }
  }

  // 重新连接
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('达到最大重连次数')
      return
    }

    this.reconnectAttempts++
    console.log(`尝试第 ${this.reconnectAttempts} 次重连...`)

    setTimeout(() => {
      this.connect(uni.getStorageSync('token'))
    }, this.reconnectInterval)
  }

  // 注册消息处理回调
  onMessage(type, callback) {
    this.messageCallbacks.set(type, callback)
  }

  // 处理接收到的消息
  handleMessage(message) {
    const { type, data } = message
    const callback = this.messageCallbacks.get(type)
    
    if (callback) {
      callback(data)
    } else {
      this.debug && console.log('未处理的消息类型：', type, data)
    }
  }

  // 关闭连接
  close() {
    if (this.socket && this.isConnected) {
      this.socket.close({
        success: () => {
          this.debug && console.log('WebSocket连接已关闭')
        },
        fail: (error) => {
          console.error('关闭WebSocket连接失败：', error)
        }
      })
    }
  }
}

// 创建单例实例
const webSocketManager = new WebSocketManager()
export default webSocketManager 