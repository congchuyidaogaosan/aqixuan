class WebSocketManager {
  constructor() {
    // 根据环境设置WebSocket地址
    // this.url = `ws://localhost:9801/imserver` 
    // this.url = `ws://8.134.184.96:9801/imserver` 
    this.url = `ws://127.0.0.1:9801/imserver` 

    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10 // 增加最大重连次数
    this.reconnectInterval = 3000 // 重连间隔时间，单位：毫秒
    this.messageCallbacks = new Map()
    this.debug = true // 始终启用调试模式
    this.lastMessage = null // 存储最新消息
    this.heartbeatTimer = null // 心跳定时器
    this.heartbeatInterval = 20000 // 20秒发送一次心跳
    this.connectionTimeout = 10000 // 连接超时时间
    this.connectionTimer = null // 连接超时定时器
    this.isReconnecting = false // 是否正在重连
    this.userId = null // 存储用户ID，便于重连
    
    // 注册默认的消息处理器
    this.registerDefaultHandlers()
  }

  // 注册默认的消息处理器
  registerDefaultHandlers() {
    // 处理聊天消息
    this.onMessage('chat', (data) => {
      console.log('收到聊天消息：', data)
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
      // console.log('收到系统通知：', data)
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
      // console.log('收到状态变更：', data)
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
    // 清除现有定时器
    this.clearTimers();
    
    if (!userId) {
      // console.error('WebSocket连接失败: userId不能为空')
      uni.$emit('wsError', { message: 'userId不能为空' })
      return
    }

    // 保存userId用于重连
    this.userId = userId;
    
    // 尝试将userId转换为字符串
    const userIdStr = String(userId);
    // console.log('尝试连接WebSocket，用户ID:', userIdStr)

    if (this.socket && this.isConnected) {
      // console.log('WebSocket已连接，无需重新连接')
      // 仍然设置心跳，确保连接保活
      this.startHeartbeat();
      return
    }
    
    // 标记非重连状态
    this.isReconnecting = false;

    try {
      // console.log('正在连接WebSocket:', `${this.url}/${userIdStr}`)
      
      // 先关闭可能存在的连接
      if (this.socket) {
        try {
          this.socket.close({
            code: 1000,
            reason: '用户主动关闭连接'
          });
          this.isConnected = false;
          this.socket = null;
        } catch (e) {
          // console.warn('关闭旧连接失败', e)
        }
      }
      
      // 设置连接超时定时器
      this.connectionTimer = setTimeout(() => {
        if (!this.isConnected) {
          // console.warn('WebSocket连接超时，尝试重连');
          this.reconnect(userIdStr);
        }
      }, this.connectionTimeout);
      
      // 创建新连接
      this.socket = uni.connectSocket({
        url: `${this.url}/${userIdStr}`,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: (res) => {
          // console.log('WebSocket连接请求已发送:', res)
        },
        fail: (err) => {
          // console.error('WebSocket连接请求失败:', err)
          this.isConnected = false
          uni.$emit('wsError', err)
          this.reconnect(userIdStr);
        },
        complete: () => {
          // console.log('WebSocket连接请求已完成')
        }
      })

      // 监听WebSocket连接打开
      this.socket.onOpen((res) => {
        // console.log('WebSocket连接已打开:', res)
        this.isConnected = true
        this.reconnectAttempts = 0
        
        // 清除连接超时定时器
        if (this.connectionTimer) {
          clearTimeout(this.connectionTimer);
          this.connectionTimer = null;
        }
        
        // 发送心跳消息以确认连接
        this.startHeartbeat();
        
        // 触发连接成功事件
        uni.$emit('wsConnected')
      })

      // 监听WebSocket错误
      this.socket.onError((error) => {
        // console.error('WebSocket错误：', error)
        this.isConnected = false
        uni.$emit('wsError', error)
        this.reconnect(userIdStr);
      })

      // 监听WebSocket关闭
      this.socket.onClose((res) => {
        // console.log('WebSocket连接已关闭，关闭码：', res.code, '原因：', res.reason)
        this.isConnected = false
        
        // 清除心跳定时器
        this.clearTimers();
        
        // 触发连接关闭事件
        uni.$emit('wsClosed', res)
        
        // 如果不是用户主动关闭，则尝试重连
        if (!res || res.code !== 1000) {
          this.reconnect(userIdStr);
        }
      })

      // 监听WebSocket消息
      this.socket.onMessage((res) => {
        // console.log('收到原始消息数据：', res.data)
        try {
          const message = JSON.parse(res.data)
          this.lastMessage = {
            ...message,
            time: new Date()
          }
          // console.log('解析后的消息：', this.lastMessage)
          
          // 处理心跳消息
          if (message.type === 'heartbeat') {
            // console.log('收到心跳响应，连接正常')
            // 重置重连次数
            this.reconnectAttempts = 0;
            return
          }
          
          // 处理其他消息
          this.handleMessage(message)
        } catch (error) {
          // console.error('解析消息失败：', error, '原始数据:', res.data)
        }
      })

    } catch (error) {
      // console.error('创建WebSocket连接失败：', error)
      this.reconnect(userIdStr)
    }
  }

  // 清除所有定时器
  clearTimers() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }
  }

  // 开始发送心跳
  startHeartbeat() {
    // 清除可能存在的旧心跳
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    
    // 立即发送一次心跳
    this.sendHeartbeat();
    
    // 设置定时发送心跳
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.sendHeartbeat();
      } else {
        // 如果连接已断开，清除心跳
        this.clearTimers();
        
        // 如果持有的socket已关闭，尝试重连
        if (this.userId && !this.isReconnecting) {
          this.reconnect(this.userId);
        }
      }
    }, this.heartbeatInterval);
  }

  // 发送心跳消息
  sendHeartbeat() {
    const heartbeat = {
      type: 'heartbeat',
      sendTime: new Date().getTime()
    }
    // console.log('发送心跳消息...');
    this.send(heartbeat);
  }

  // 重新连接
  reconnect(userId) {
    if (this.isReconnecting) {
      // console.log('已在重连中，忽略此次重连请求');
      return;
    }
    
    this.isReconnecting = true;
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      // console.log('达到最大重连次数，放弃重连')
      this.isReconnecting = false;
      uni.$emit('wsReconnectFailed', { message: '达到最大重连次数' });
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectInterval * Math.min(this.reconnectAttempts, 10); // 指数退避策略
    // console.log(`尝试第 ${this.reconnectAttempts} 次重连... 将在 ${delay/1000} 秒后重连`);
    uni.$emit('wsReconnecting', { attempts: this.reconnectAttempts, maxAttempts: this.maxReconnectAttempts });

    setTimeout(() => {
      this.isReconnecting = false;
      if (!this.isConnected) {
        // 清除之前的连接状态
        if (this.socket) {
          try {
            this.socket.close();
          } catch (e) {
            // console.warn('关闭旧连接失败', e);
          }
          this.socket = null;
        }
        
        // 尝试重新连接
        this.connect(userId);
      }
    }, delay);
  }

  // 注册消息处理回调
  onMessage(type, callback) {
    this.messageCallbacks.set(type, callback)
  }

  // 处理接收到的消息
  handleMessage(mes) {
    // console.log('处理消息：', mes)

    // 判断消息类型并执行相应处理
    if (mes.type === 'error') {
      // console.error('收到错误消息:', mes.message);
      uni.$emit('wsError', mes);
      return;
    }
    
    if (mes.type === 'system' || mes.type === 'ack' || mes.type === 'sendSuccess' || mes.type === 'offlineMessage') {
      // console.log('收到系统消息:', mes.type, mes.message);
      uni.$emit('wsSystemMessage', mes);
      return;
    }

    // 获取当前用户ID
    const userInfo = uni.getStorageSync('userInfo')
    const currentUserId = userInfo?.id
    
    if (!currentUserId) {
      // console.warn('处理消息失败：当前用户ID为空')
    }

    // 如果是聊天消息，判断方向后触发事件
    const chatMessage = mes
    
    // 转换ID为数字以便比较
    const senderId = Number(chatMessage.senderId);
    const receiverId = Number(chatMessage.receiverId);
    const currentIdNum = Number(currentUserId);
    
    // console.log('消息方向判断:', {
    //   senderId: senderId,
    //   receiverId: receiverId,
    //   currentUserId: currentIdNum
    // })
    
    // 添加消息方向标记
    if(senderId === currentIdNum) {
      chatMessage.direction = 'send' // 发送的消息
      // console.log('标记为发送消息')
    } else if(receiverId === currentIdNum) {
      chatMessage.direction = 'receive' // 接收的消息
      // console.log('标记为接收消息')
    } else {
      // console.warn('无法确定消息方向')
    }

    // console.log('触发聊天消息事件：', chatMessage)
    uni.$emit('onChatMessage', chatMessage)

    // 处理其他类型的消息
    const callback = this.messageCallbacks.get(mes.type)
    if (callback) {
      callback(mes.message || mes)
    } else {
      // console.log('未找到消息类型处理器：', mes.type, mes)
    }
  }

  // 关闭连接
  close() {
    // 清除所有定时器
    this.clearTimers();
    
    if (this.socket) {
      // console.log('主动关闭WebSocket连接')
      this.socket.close({
        code: 1000, // 正常关闭
        reason: '用户主动关闭连接',
        success: () => {
          // console.log('WebSocket连接已成功关闭')
          this.isConnected = false
          this.socket = null;
        },
        fail: (error) => {
          // console.error('关闭WebSocket连接失败：', error)
        }
      })
    }
  }

  // 发送消息到WebSocket服务器
  send(message) {
    if (!this.socket) {
      // console.error('WebSocket实例不存在，无法发送消息')
      return
    }
    
    if (!this.isConnected) {
      // console.error('WebSocket未连接，无法发送消息')
      return
    }
    
    try {
      const jsonMessage = typeof message === 'string' ? message : JSON.stringify(message);
      // console.log('发送消息：', jsonMessage)
      
      this.socket.send({
        data: jsonMessage,
        success: () => {
          // console.log('消息发送成功');
        },
        fail: (error) => {
          // console.error('消息发送失败：', error);
          
          // 如果发送失败，检查连接是否已断开
          if (this.userId && !this.isReconnecting) {
            this.checkConnection();
          }
        }
      });
    } catch (error) {
      // console.error('消息序列化或发送失败：', error);
      
      // 尝试重新连接
      if (this.userId && !this.isReconnecting) {
        this.reconnect(this.userId);
      }
    }
  }

  // 检查WebSocket连接状态
  checkConnection() {
    // console.log('检查WebSocket连接状态...');
    if (!this.isConnected && this.userId && !this.isReconnecting) {
      // console.log('连接已断开，尝试重连...');
      this.reconnect(this.userId);
    } else {
      // 发送一个心跳检查连接
      this.sendHeartbeat();
    }
  }

  // 获取最新消息
  getLastMessage() {
    return this.lastMessage
  }
  
  // 获取连接状态
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      socketInstance: !!this.socket,
      isReconnecting: this.isReconnecting
    }
  }
}

// 创建单例实例
const webSocketManager = new WebSocketManager()
export default webSocketManager 