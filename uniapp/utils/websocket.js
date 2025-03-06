class WebSocketManager {
  constructor() {
    // 根据环境设置WebSocket地址
    this.url = `ws://localhost:8081/imserver` 
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000 // 重连间隔时间，单位：毫秒
    this.messageCallbacks = new Map()
    this.debug = process.env.NODE_ENV === 'development'
    this.lastMessage = null // 存储最新消息
    
    // 注册默认的消息处理器
    this.registerDefaultHandlers()
  }

  // 注册默认的消息处理器
  registerDefaultHandlers() {
    // 处理聊天消息
    this.onMessage('chat', (data) => {
      this.debug && console.log('收到聊天消息：', data)
      this.lastMessage = {
        type: 'chat',
        data,
        time: new Date()
      }
      // 触发全局事件
      uni.$emit('onChatMessage', data)
    })

    // 处理系统通知
    this.onMessage('notification', (data) => {
      this.debug && console.log('收到系统通知：', data)
      this.lastMessage = {
        type: 'notification',
        data,
        time: new Date()
      }
      // 触发全局事件
      uni.$emit('onNotification', data)
    })

    // 处理在线状态变更
    this.onMessage('status', (data) => {
      this.debug && console.log('收到状态变更：', data)
      this.lastMessage = {
        type: 'status',
        data,
        time: new Date()
      }
      // 触发全局事件
      uni.$emit('onStatusChange', data)
    })
  }

  // 初始化WebSocket连接
  connect(userId) {
    if (this.socket && this.isConnected) {
      this.debug && console.log('WebSocket已连接')
      return
    }

    try {
      this.debug && console.log('正在连接WebSocket:', this.url)
      this.socket = uni.connectSocket({
        url: `${this.url}/${userId}`,
        complete: () => {}
      })

      // 监听WebSocket连接打开
      this.socket.onOpen(() => {
        this.debug && console.log('WebSocket连接已打开')
        this.isConnected = true
        this.reconnectAttempts = 0
        
        // 触发连接成功事件
        uni.$emit('wsConnected')
      })

      // 监听WebSocket错误
      this.socket.onError((error) => {
        console.error('WebSocket错误：', error)
        this.isConnected = false
        this.reconnect(userId)
        
        // 触发连接错误事件
        uni.$emit('wsError', error)
      })

      // 监听WebSocket关闭
      this.socket.onClose(() => {
        this.debug && console.log('WebSocket连接已关闭')
        this.isConnected = false
        this.reconnect(userId)
        
        // 触发连接关闭事件
        uni.$emit('wsClosed')
      })

      // 监听WebSocket消息
      this.socket.onMessage((res) => {
        try {
          const message = JSON.parse(res.data)
          this.lastMessage = {
            ...message,
            time: new Date()
          }
          console.log('收到消息：', this.lastMessage)
          
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
      this.reconnect(userId)
    }
  }

  // 重新连接
  reconnect(userId) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('达到最大重连次数')
      return
    }

    this.reconnectAttempts++
    console.log(`尝试第 ${this.reconnectAttempts} 次重连...`)

    setTimeout(() => {
      this.connect(userId)
    }, this.reconnectInterval)
  }

  // 注册消息处理回调
  onMessage(type, callback) {
    this.messageCallbacks.set(type, callback)
  }

  // 处理接收到的消息
  handleMessage(mes) {
    if (this.debug) {
      console.log('处理消息：', mes)
      console.log('消息类型：', mes.type)
      console.log('消息内容：', mes.message || mes)
    }

    // 获取当前用户ID
    const userInfo = uni.getStorageSync('userInfo')
    const currentUserId = userInfo?.id

    // 如果是聊天消息，判断方向后触发事件
    const chatMessage =  mes
    
    console.log('chatMessage', chatMessage.senderId, chatMessage.receiverId, currentUserId)
    // 添加消息方向标记
    if(chatMessage.senderId === currentUserId) {
      chatMessage.direction = 'send' // 发送的消息
    } else if(chatMessage.receiverId === currentUserId) {
      chatMessage.direction = 'receive' // 接收的消息
    }

    this.debug && console.log('触发聊天消息事件：', chatMessage)
    uni.$emit('onChatMessage', chatMessage)

    // 处理其他类型的消息
    const callback = this.messageCallbacks.get(mes.type)
    if (callback) {
      callback(mes.message || mes)
    } else {
      this.debug && console.log('未处理的消息类型：', mes.type, mes)
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

  // 发送消息到WebSocket服务器
  send(message) {
    if (this.socket && this.isConnected) {
      try {
        const jsonMessage = JSON.stringify(message);
        this.socket.send({
          data: jsonMessage,
          success: () => {
            this.debug && console.log('消息发送成功：', message);
          },
          fail: (error) => {
            console.error('消息发送失败：', error);
          }
        });
      } catch (error) {
        console.error('消息序列化失败：', error);
      }
    } else {
      console.log('WebSocket未连接，无法发送消息');
    }
  }


  // 获取最新消息
  getLastMessage() {
    return this.lastMessage
  }
}

// 创建单例实例
const webSocketManager = new WebSocketManager()
export default webSocketManager 