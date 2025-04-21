<template>
    <view class="verify-code-container">
        <view class="header">
            <text class="title">验证手机号</text>
            <text class="subtitle">验证码已发送至 {{ maskPhone(phone) }}</text>
        </view>

        <!-- 验证码输入框 -->
        <view class="code-input-area">
            <input type="number" :maxlength="4" v-model="code" class="code-input" placeholder="请输入验证码"
                @input="handleCodeInput" />
            <view class="code-timer">
                <text v-if="countdown > 0">{{ countdown }}秒后重新获取</text>
                <text v-else class="resend" @click="sendCode">重新获取验证码</text>
            </view>
        </view>

        <!-- 确认按钮 -->
        <button class="confirm-btn" :disabled="code.length !== 6" :class="{ 'btn-active': code.length === 6 }"
            @click="handleVerify">
            确认
        </button>
    </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { sendSmsCode } from '@/api/user.js'

const props = defineProps({
    type: {
        type: String,
        required: true,
        // 可选值：modify-phone/modify-password/verification/delete-account
    }
})

const phone = ref('')
const code = ref('')
const countdown = ref(0)
let timer = null

// 页面加载时获取手机号并发送验证码
onMounted(() => {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo?.phone) {
        phone.value = userInfo.phone
        sendCode()
    }
})

// 清理定时器
onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})

// 发送验证码
const sendCode = async () => {
    if (countdown.value > 0) return

    uni.showLoading({ title: '发送中' })

    try {
        // 调用发送验证码接口
        const result = await sendSmsCode(phone.value)
        console.log(result)


        // 开始倒计时
        countdown.value = 60
        timer = setInterval(() => {
            if (countdown.value > 0) {
                countdown.value--
            } else {
                clearInterval(timer)
                timer = null
            }
        }, 1000)

        uni.hideLoading()
        uni.showToast({ title: '验证码已发送', icon: 'none' })
        
        if(result.code){
            // 赋值
            code.value = result.code
        }
    } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: '发送失败，请重试', icon: 'none' })
    }
}

// 处理验证码输入
const handleCodeInput = (e) => {
    code.value = e.detail.value.slice(0, 4)
}

// 手机号脱敏处理
const maskPhone = (phone) => {
    if (!phone) return ''
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 验证处理
const handleVerify = async () => {
    if (code.value.length !== 6) return

    uni.showLoading({ title: '验证中' })

    try {
        // TODO: 调用验证码验证接口
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟请求

        // 根据不同类型跳转到不同页面
        const pages = {
            'modify-phone': '/pages/modify-phone/modify-phone',
            'verification': '/pages/verification/verification',
            'delete-account': '/pages/delete-account/delete-account'
        }

        uni.hideLoading()

        if (pages[props.type]) {
            uni.navigateTo({
                url: `${pages[props.type]}?verified=true`
            })
        }
    } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: '验证失败，请重试', icon: 'none' })
    }
}
</script>

<style lang="scss" scoped>
.verify-code-container {
    padding: 40rpx;

    .header {
        margin-bottom: 60rpx;

        .title {
            font-size: 36rpx;
            font-weight: 500;
            color: #333;
            margin-bottom: 20rpx;
            display: block;
        }

        .subtitle {
            font-size: 28rpx;
            color: #999;
        }
    }

    .code-input-area {
        margin-bottom: 60rpx;

        .code-input {
            height: 100rpx;
            background: #f5f5f5;
            border-radius: 12rpx;
            padding: 0 30rpx;
            font-size: 32rpx;
            margin-bottom: 20rpx;
        }

        .code-timer {
            text-align: center;
            font-size: 28rpx;
            color: #999;

            .resend {
                color: #007AFF;
            }
        }
    }

    .confirm-btn {
        width: 100%;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        background: #e0e0e0;
        color: #fff;
        font-size: 32rpx;
        border-radius: 45rpx;
        border: none;

        &.btn-active {
            background: #007AFF;
        }
    }
}
</style>