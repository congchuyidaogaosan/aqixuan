<template>
  <view class="publish-partner">
    <!-- 头部导航 -->
    <view class="nav-header">
      <view class="left" @click="goBack">
        <image src="/static/images/back.png" mode="aspectFit" class="back-icon"></image>
      </view>
      <view class="title">发布活动</view>
      <view class="right"></view>
    </view>
    
    <!-- 表单内容 -->
    <scroll-view class="content" scroll-y>
      <!-- 活动类型 -->
      <view class="form-item" @click="showActivityTypePopup">
        <view class="label">活动类型</view>
        <view class="value">
          <text :class="{'placeholder': formData.activityType === ''}">
            {{formData.activityType !== '' ? activityTypes.find(t => t.value === formData.activityType)?.label : '请选择活动类型'}}
          </text>
          <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
        </view>
      </view>
      
      <!-- 添加图片上传 -->
      <view class="form-item">
        <view class="label">活动图片</view>
        <view class="upload-box" @click="chooseImage" v-if="!formData.image">
          <image src="/static/images/upload.png" mode="aspectFit" class="upload-icon"></image>
          <text class="upload-text">上传图片</text>
        </view>
        <view class="image-preview" v-else>
          <image :src="formData.image" mode="aspectFill" class="preview-image"></image>
          <view class="delete-btn" @click.stop="deleteImage">
            <image src="/static/images/close.png" mode="aspectFit" class="delete-icon"></image>
          </view>
        </view>
      </view>
      
      <!-- 活动详情 -->
      <view class="form-section">
        <view class="section-title">活动详情</view>
        
        <!-- 活动名称 -->
        <view class="input-item">
        <input 
          type="text" 
          v-model="formData.title" 
            placeholder="请填写活动名称"
            placeholder-class="placeholder"
        />
      </view>
      
        <!-- 活动人数 -->
        <view class="input-item">
        <input 
          type="number" 
          v-model="formData.totalNumber" 
            placeholder="请填写活动人数(含发起人)"
            placeholder-class="placeholder"
        />
      </view>
      
        <!-- 活动时间 -->
        <view class="time-section">
        <view class="time-picker">
            <text class="label">开始时间</text>
            <view class="picker-wrapper" @click="showTimePicker('start')">
              <view class="picker-group">
                <view :class="{'placeholder': !formData.startTime}">
                  {{formData.startTime ? formatDateTimeString(formData.startTime) : '选择时间'}}
          </view>
              </view>
              <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
            </view>
          </view>
          <view class="time-picker">
            <text class="label">结束时间</text>
            <view class="picker-wrapper" @click="showTimePicker('end')">
              <view class="picker-group">
                <view :class="{'placeholder': !formData.endTime}">
                  {{formData.endTime ? formatDateTimeString(formData.endTime) : '选择时间'}}
                </view>
              </view>
              <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
          </view>
        </view>
      </view>
      
        <!-- 活动地点 -->
        <view class="location-section">
          <view class="location-picker" @click="chooseLocation">
            <image src="/static/images/location.png" mode="aspectFit" class="location-icon"></image>
            <text :class="{'placeholder': !formData.location}">{{formData.location || '请选择活动地点'}}</text>
            <image src="/static/images/arrow-right.png" mode="aspectFit" class="arrow-icon"></image>
          </view>
        </view>
        
        <!-- 费用类型 -->
        <view class="cost-section">
          <view class="cost-type">
            <text 
              :class="['type-btn', {'active': formData.costType === 0}]"
              @click="handleCostTypeChange('free')"
            >免费</text>
            <text 
              :class="['type-btn', {'active': formData.costType === 1}]"
              @click="handleCostTypeChange('aa')"
            >AA</text>
            <text 
              :class="['type-btn', {'active': formData.costType === 2}]"
              @click="handleCostTypeChange('other')"
            >其他</text>
          </view>
          
          <view class="deposit-input" v-if="formData.costType === 1 || formData.costType === 2">
          <input 
            type="digit" 
            v-model="formData.cost" 
              :placeholder="formData.costType === 1 ? '请输入总费用（将平均分配）' : '请输入总费用金额'"
              placeholder-class="placeholder"
          />
            <text class="unit">元</text>
        </view>
          
          <view class="cost-tip" v-if="formData.costType === 1">
            <text>每人预计支付：{{calculateAACost}}元</text>
      </view>
      
          <!-- 添加鸽子费输入框 -->
          <view class="penalty-section" v-if="formData.costType !== 0">
            <view class="penalty-title">
              <text>鸽子费设置</text>
              <text class="penalty-tip">（报名后不参加将扣除该费用）</text>
            </view>
            <view class="deposit-input">
        <input 
          type="digit" 
          v-model="formData.penaltyCost" 
                placeholder="请输入鸽子费金额"
                placeholder-class="placeholder"
        />
              <text class="unit">元</text>
            </view>
          </view>
        </view>
        
        <!-- 活动介绍 -->
        <view class="desc-section">
          <textarea 
            v-model="formData.description"
            placeholder="请详细描述活动内容、要求等"
            placeholder-class="placeholder"
            maxlength="500"
            :show-confirm-bar="false"
          ></textarea>
          <text class="word-count">{{formData.description.length}}/500</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btn">
      <button class="publish-btn" @click="handlePublish">立即发布</button>
    </view>
    
    <!-- 活动类型弹窗 -->
    <uni-popup ref="activityTypePopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">选择活动类型</text>
          <text class="close" @click="hideActivityTypePopup">关闭</text>
        </view>
        <view class="popup-body">
          <view 
            class="popup-item"
            v-for="type in activityTypes"
            :key="type.value"
            @click="selectActivityType(type)"
          >
            <text :class="{'active': formData.activityType === type.value}">{{type.label}}</text>
          </view>
        </view>
      </view>
    </uni-popup>
    
    
    <!-- 时间选择弹窗 -->
    <uni-popup ref="timePopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">选择时间</text>
          <text class="close" @click="hideTimePopup">关闭</text>
        </view>
        <view class="picker-view-wrapper">
          <picker-view
            :value="currentDateTimeIndexes"
            class="picker-view"
            @change="onPickerChange"
          >
            <picker-view-column>
              <view class="item" v-for="year in years" :key="year">{{year}}年</view>
            </picker-view-column>
            <picker-view-column>
              <view class="item" v-for="month in months" :key="month">{{month}}月</view>
            </picker-view-column>
            <picker-view-column>
              <view class="item" v-for="day in days" :key="day">{{day}}日</view>
            </picker-view-column>
            <picker-view-column>
              <view class="item" v-for="hour in hours" :key="hour">{{hour}}时</view>
            </picker-view-column>
            <picker-view-column>
              <view class="item" v-for="minute in minutes" :key="minute">{{minute}}分</view>
            </picker-view-column>
          </picker-view>
          <view class="picker-actions">
            <button class="cancel-btn" @click="hideTimePopup">取消</button>
            <button class="confirm-btn" @click="confirmDateTime">确定</button>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { publishActivity, uploadFile } from '@/api/user'
// 获取当前时间作为默认值
const now = new Date()
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

// 格式化日期
const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化时间
const formatTime = (date) => {
  const d = new Date(date)
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${hour}:${minute}`
}

// 格式化日期时间为指定格式
const formatDateTimeString = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 计算AA费用
const calculateAACost = computed(() => {
  if (formData.value.costType !== 1 || !formData.value.cost || !formData.value.totalNumber) {
    return '0.00'
  }
  const perPersonCost = parseFloat(formData.value.cost) / parseInt(formData.value.totalNumber)
  return perPersonCost.toFixed(2)
})

// 表单数据
const formData = ref({
  activityType: '',
  visibility: '公开',
  title: '',
  totalNumber: '',
  currentNumber: 1,
  startTime: '',
  endTime: '',
  location: '',
  costType: 0,
  cost: 0,
  penaltyCost: 0,
  description: '',
  image: ''
})

// 活动类型选项
const activityTypes = [
  { label: '运动', value: 0 },
  { label: '游戏', value: 1 },
  { label: '旅行', value: 2 },
  { label: '学习', value: 3 },
  { label: '美食', value: 4 },
  { label: '电影', value: 5 },
  { label: '其他', value: 6 }
]


// 活动类型弹窗
const activityTypePopup = ref(null)
const showActivityTypePopup = () => {
  activityTypePopup.value.open()
}
const hideActivityTypePopup = () => {
  activityTypePopup.value.close()
}
const selectActivityType = (type) => {
  formData.value.activityType = type.value
  hideActivityTypePopup()
}



// 时间选择器数据
const years = ref([])
const months = ref([])
const days = ref([])
const hours = ref([])
const minutes = ref([])
const currentDateTimeIndexes = ref([0, 0, 0, 0, 0])
const currentTimeType = ref('start') // 'start' 或 'end'
const timePopup = ref(null)

// 初始化时间选择器数据
const initTimePickerData = () => {
  // 年份：当前年份到未来3年
  const currentYear = new Date().getFullYear()
  years.value = Array.from({length: 4}, (_, i) => currentYear + i)
  
  updateMonths()
}

// 更新月份选项
const updateMonths = () => {
  const currentDate = new Date()
  const selectedYear = years.value[currentDateTimeIndexes.value[0]]
  
  if (selectedYear === currentDate.getFullYear()) {
    // 如果是当前年份，则从当前月份开始
    months.value = Array.from(
      {length: 12 - currentDate.getMonth()}, 
      (_, i) => currentDate.getMonth() + i + 1
    )
    // 如果当前选择的月份小于当前月份，重置为当前月份
    if (currentDateTimeIndexes.value[1] < currentDate.getMonth()) {
      currentDateTimeIndexes.value[1] = 0 // 重置为当前可选月份的第一个
    }
  } else {
    // 如果是未来年份，显示所有月份
    months.value = Array.from({length: 12}, (_, i) => i + 1)
  }
  
  updateDays()
}

// 更新天数选项
const updateDays = () => {
  const currentDate = new Date()
  const selectedYear = years.value[currentDateTimeIndexes.value[0]]
  const selectedMonth = months.value[currentDateTimeIndexes.value[1]]
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
  
  if (selectedYear === currentDate.getFullYear() && 
      selectedMonth === currentDate.getMonth() + 1) {
    // 如果是当前年月，则从当前日期开始
    days.value = Array.from(
      {length: daysInMonth - currentDate.getDate() + 1}, 
      (_, i) => currentDate.getDate() + i
    )
    // 如果当前选择的日期超出了当月天数或小于当前日期，重置为第一个可选日期
    if (currentDateTimeIndexes.value[2] >= days.value.length || 
        currentDateTimeIndexes.value[2] < 0) {
      currentDateTimeIndexes.value[2] = 0
    }
  } else {
    // 如果是未来年月，显示所有日期
    days.value = Array.from({length: daysInMonth}, (_, i) => i + 1)
    // 如果当前选择的日期超出了当月天数，重置为当月最后一天
    if (currentDateTimeIndexes.value[2] >= daysInMonth) {
      currentDateTimeIndexes.value[2] = daysInMonth - 1
    }
  }
  
  updateHours()
}

// 更新小时选项
const updateHours = () => {
  const currentDate = new Date()
  const selectedYear = years.value[currentDateTimeIndexes.value[0]]
  const selectedMonth = months.value[currentDateTimeIndexes.value[1]]
  const selectedDay = days.value[currentDateTimeIndexes.value[2]]
  
  if (selectedYear === currentDate.getFullYear() && 
      selectedMonth === currentDate.getMonth() + 1 && 
      selectedDay === currentDate.getDate()) {
    // 如果是当前日期，则从当前小时开始
    hours.value = Array.from(
      {length: 24 - currentDate.getHours()}, 
      (_, i) => String(currentDate.getHours() + i).padStart(2, '0')
    )
    // 如果当前选择的小时小于当前小时，重置为当前小时
    if (currentDateTimeIndexes.value[3] < currentDate.getHours()) {
      currentDateTimeIndexes.value[3] = 0 // 重置为当前可选小时的第一个
    }
  } else {
    // 如果是未来日期，显示所有小时
    hours.value = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'))
  }
  
  updateMinutes()
}

// 更新分钟选项
const updateMinutes = () => {
  const currentDate = new Date()
  const selectedYear = years.value[currentDateTimeIndexes.value[0]]
  const selectedMonth = months.value[currentDateTimeIndexes.value[1]]
  const selectedDay = days.value[currentDateTimeIndexes.value[2]]
  const selectedHour = Number(hours.value[currentDateTimeIndexes.value[3]])
  
  if (selectedYear === currentDate.getFullYear() && 
      selectedMonth === currentDate.getMonth() + 1 && 
      selectedDay === currentDate.getDate() && 
      selectedHour === currentDate.getHours()) {
    // 如果是当前时间，则从当前分钟开始
    minutes.value = Array.from(
      {length: 60 - currentDate.getMinutes()}, 
      (_, i) => String(currentDate.getMinutes() + i).padStart(2, '0')
    )
    // 如果当前选择的分钟小于当前分钟，重置为当前分钟
    if (currentDateTimeIndexes.value[4] < currentDate.getMinutes()) {
      currentDateTimeIndexes.value[4] = 0 // 重置为当前可选分钟的第一个
    }
  } else {
    // 如果是未来时间，显示所有分钟
    minutes.value = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'))
  }
}

// 处理选择器变化
const onPickerChange = (e) => {
  const oldIndexes = [...currentDateTimeIndexes.value]
  const newIndexes = [...e.detail.value]
  
  // 判断哪一列发生了变化
  for (let i = 0; i < 5; i++) {
    if (oldIndexes[i] !== newIndexes[i]) {
      currentDateTimeIndexes.value = newIndexes
      switch(i) {
        case 0: // 年份变化
          updateMonths()
          break
        case 1: // 月份变化
          updateDays()
          break
        case 2: // 日期变化
          updateHours()
          break
        case 3: // 小时变化
          updateMinutes()
          break
      }
      break
    }
  }
}

// 显示时间选择器
const showTimePicker = (type) => {
  currentTimeType.value = type
  let currentDate = type === 'start' ? 
    (formData.value.startTime ? new Date(formData.value.startTime) : new Date()) :
    (formData.value.endTime ? new Date(formData.value.endTime) : new Date())
  
  // 如果时间早于当前时间，使用当前时间
  const now = new Date()
  if (currentDate < now) {
    currentDate = now
  }
  
  // 设置当前选中值
  const yearIndex = years.value.indexOf(currentDate.getFullYear())
  const monthIndex = months.value.indexOf(currentDate.getMonth() + 1)
  const dayIndex = days.value.indexOf(currentDate.getDate())
  const hourIndex = hours.value.indexOf(String(currentDate.getHours()).padStart(2, '0'))
  const minuteIndex = minutes.value.indexOf(String(currentDate.getMinutes()).padStart(2, '0'))
  
  currentDateTimeIndexes.value = [
    yearIndex >= 0 ? yearIndex : 0,
    monthIndex >= 0 ? monthIndex : 0,
    dayIndex >= 0 ? dayIndex : 0,
    hourIndex >= 0 ? hourIndex : 0,
    minuteIndex >= 0 ? minuteIndex : 0
  ]
  
  // 确保所有选项都已更新
  updateMonths()
  updateDays()
  updateHours()
  updateMinutes()
  
  timePopup.value.open()
}

// 隐藏时间选择器
const hideTimePopup = () => {
  timePopup.value.close()
}

// 确认选择
const confirmDateTime = () => {
  const selectedYear = years.value[currentDateTimeIndexes.value[0]]
  const selectedMonth = months.value[currentDateTimeIndexes.value[1]]
  const selectedDay = days.value[currentDateTimeIndexes.value[2]]
  const selectedHour = hours.value[currentDateTimeIndexes.value[3]]
  const selectedMinute = minutes.value[currentDateTimeIndexes.value[4]]
  
  const selectedDate = new Date(
    selectedYear,
    selectedMonth - 1,
    selectedDay,
    Number(selectedHour),
    Number(selectedMinute)
  )
  
  // 再次验证是否早于当前时间
  const currentDate = new Date()
  if (selectedDate < currentDate) {
    uni.showToast({
      title: '不能选择过去的时间',
      icon: 'none'
    })
    return
  }
  
  // 直接设置为Date对象
  if (currentTimeType.value === 'start') {
    formData.value.startTime = selectedDate
  } else {
    formData.value.endTime = selectedDate
  }
  
  validateTimeRange()
  hideTimePopup()
}

// 验证时间范围
const validateTimeRange = () => {
  if (!formData.value.startTime || !formData.value.endTime) return
  
  const startDateTime = new Date(formData.value.startTime)
  const endDateTime = new Date(formData.value.endTime)
  
  if (endDateTime < startDateTime) {
    uni.showToast({
      title: '结束时间不能早于开始时间',
      icon: 'none'
    })
    // 重置为开始时间后一小时
    const newEndTime = new Date(startDateTime)
    newEndTime.setHours(newEndTime.getHours() + 1)
    formData.value.endTime = newEndTime
  }
}

// 选择地点
const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      console.log('选择地点成功：', res)
      formData.value.location = res.name
      formData.value.latitude = res.latitude
      formData.value.longitude = res.longitude
    }
  })
}

// 选择图片
const chooseImage = async () => {
  const res = await uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera']
  })
  
  uni.showLoading({ title: '上传中...' })
  
  try {
    // 上传选中的文件
    const file = res.tempFiles[0]
    const blob = new Blob([file], { type: file.type || 'image/jpeg' })
    const fileToUpload = new File([blob], file.name || 'image.jpg', {
      type: file.type || 'image/jpeg'
    })
    
    // 上传文件
    const uploadRes = await uploadFile(fileToUpload)
    if (uploadRes.code === 200) {
      formData.value.image = uploadRes.data.url
      uni.showToast({
        title: '上传成功',
        icon: 'success'
      })
    } else {
      uni.showToast({
        title: uploadRes.msg || '上传失败',
        icon: 'none'
      })
    }
  } catch (err) {
    uni.showToast({
      title: '上传失败',
      icon: 'none'
    })
    console.error('上传失败：', err)
  } finally {
    uni.hideLoading()
  }
}

// 删除图片
const deleteImage = (e) => {
  e.stopPropagation()
  formData.value.image = ''
}

// 发布活动
const handlePublish = () => {
  // 表单验证
  if (formData.value.activityType === '') {
    uni.showToast({
      title: '请选择活动类型',
      icon: 'none'
    })
    return
  }
  if (!formData.value.title) {
    uni.showToast({
      title: '请填写活动名称',
      icon: 'none'
    })
    return
  }
  if (!formData.value.totalNumber || formData.value.totalNumber < 2) {
    uni.showToast({
      title: '活动人数至少需要2人',
      icon: 'none'
    })
    return
  }
  if (!formData.value.startTime || !formData.value.endTime) {
    uni.showToast({
      title: '请选择活动时间',
      icon: 'none'
    })
    return
  }
  if (!formData.value.location) {
    uni.showToast({
      title: '请选择活动地点',
      icon: 'none'
    })
    return
  }
  if ((formData.value.costType === 1 || formData.value.costType === 2) && !formData.value.cost) {
    uni.showToast({
      title: '请输入活动费用',
      icon: 'none'
    })
    return
  }
  if (!formData.value.description) {
    uni.showToast({
      title: '请填写活动介绍',
      icon: 'none'
    })
    return
  }
  if (!formData.value.image) {
    uni.showToast({
      title: '请上传活动图片',
      icon: 'none'
    })
    return
  }

  // 转换数据类型并格式化日期
  const submitData = {
    // 活动类型
    activityType: formData.value.activityType,
    // 活动名称
    title: formData.value.title,
    // 活动介绍
    description: formData.value.description,
    // 活动地点
    location: formData.value.location,
    // 经纬度拼接
    ip: formData.value.longitude + "," + formData.value.latitude,
    // 活动人数
    totalNumber: parseInt(formData.value.totalNumber),
    // 当前人数
    currentNumber: 1,
    // 开始时间
    startTime: formatDateTimeString(formData.value.startTime), // 转换为指定格式字符串
    // 结束时间
    endTime: formatDateTimeString(formData.value.endTime), // 转换为指定格式字符串
    // 活动费用
    cost: formData.value.cost ? parseFloat(formData.value.cost) : 0,
    // 费用类型
    costType: formData.value.costType,
    // 鸽子费
    penaltyCost: formData.value.penaltyCost ? parseFloat(formData.value.penaltyCost) : 0,
    // 活动图片
    handImg: formData.value.image
  }
  
  // 显示加载提示
  uni.showLoading({
    title: '发布中...',
    mask: true
  })
  console.log('submitData', submitData)
  
  // 调用发布接口
  publishActivity(submitData).then(res => {
    uni.hideLoading()
      uni.showToast({
        title: '发布成功',
        icon: 'success'
      })
      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    
  }).catch(err => {
    uni.hideLoading()
    console.error('发布失败：', err)
    uni.showToast({
      title: '发布失败，请重试',
      icon: 'none'
    })
  })
}

// 返回上一页
const goBack = () => {
  history.back();
}

// 在 onMounted 中初始化
onMounted(() => {
  initTimePickerData()
})

// 处理费用类型变化
const handleCostTypeChange = (type) => {
  switch(type) {
    case 'free':
      formData.value.costType = 0
      formData.value.cost = 0
      formData.value.penaltyCost = 0
      break
    case 'aa':
      formData.value.costType = 1
      formData.value.cost = ''
      formData.value.penaltyCost = 0
      break
    case 'other':
      formData.value.costType = 2
      formData.value.cost = ''
      formData.value.penaltyCost = 0
      break
  }
}
</script>

<style lang="less" scoped>
.publish-partner {
  min-height: 100vh;
  background: #f8f8f8;
  
  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    height: 88rpx;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
    
    .left {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      
      .back-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
    
    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
    
    .right {
      width: 60rpx;
    }
  }
  
  .content {
    height: calc(100vh - 88rpx - 120rpx);
    
    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 20rpx;
      background: #fff;
      margin-bottom: 2rpx;
      
      .label {
        font-size: 28rpx;
        color: #333;
      }
      
      .value {
        display: flex;
        align-items: center;
        gap: 8rpx;
        
        text {
          font-size: 28rpx;
          color: #333;
          
          &.placeholder {
            color: #999;
          }
        }
        
        .arrow-icon {
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
    
    .form-section {
      margin-top: 20rpx;
      background: #fff;
      padding: 0 20rpx;
      
      .section-title {
        padding: 20rpx 0;
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
      }
      
      .input-item {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f5f5f5;
        
        input {
          width: 100%;
          height: 40rpx;
          font-size: 28rpx;
          color: #333;
        }
      }
      
      .time-section {
        padding: 20rpx 0;
        
        .time-picker {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20rpx 0;
          border-bottom: 1rpx solid #f5f5f5;
          
          .label {
            font-size: 28rpx;
            color: #333;
            min-width: 140rpx;
          }
          
          .picker-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 8rpx;
            
            .picker-group {
              display: flex;
              gap: 20rpx;
              
              view {
                font-size: 28rpx;
                color: #333;
                text-align: center;
                
                &.placeholder {
                  color: #999;
                }
              }
            }
            
            .arrow-icon {
              width: 32rpx;
              height: 32rpx;
              margin-left: 8rpx;
            }
          }
        }
      }
      
      .location-section {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f5f5f5;
        
        .location-picker {
          display: flex;
          align-items: center;
          gap: 12rpx;
          
          .location-icon {
            width: 32rpx;
            height: 32rpx;
          }
          
          text {
            flex: 1;
            font-size: 28rpx;
            color: #333;
            
            &.placeholder {
              color: #999;
            }
          }
          
          .arrow-icon {
            width: 32rpx;
            height: 32rpx;
          }
        }
      }
      
      .cost-section {
        padding: 20rpx 0;
        
        .cost-type {
          display: flex;
          gap: 20rpx;
          margin-bottom: 20rpx;
          
          .type-btn {
            padding: 10rpx 30rpx;
            font-size: 26rpx;
            color: #666;
            background: #f5f5f5;
            border-radius: 30rpx;
            
            &.active {
              color: #fff;
              background: #007AFF;
            }
          }
        }
        
        .deposit-input {
          display: flex;
          align-items: center;
          gap: 12rpx;
          
          input {
            flex: 1;
            height: 40rpx;
            font-size: 28rpx;
            color: #333;
          }
          
          .unit {
            font-size: 28rpx;
            color: #666;
          }
        }
      }
      
      .desc-section {
        padding: 20rpx 0;
        position: relative;
        
        textarea {
          width: 100%;
          height: 200rpx;
          font-size: 28rpx;
          color: #333;
        }
        
        .word-count {
          position: absolute;
          right: 0;
          bottom: 20rpx;
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
  
  .bottom-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx;
    background: #fff;
    
    .publish-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 30rpx;
      color: #fff;
      background: #007AFF;
      border-radius: 40rpx;
    }
  }
}

.popup-content {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 20rpx;
    border-bottom: 1rpx solid #f5f5f5;
    
    .title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
    }
    
    .close {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .popup-body {
    padding: 20rpx;
    max-height: 60vh;
    overflow-y: auto;
    
    .popup-item {
      padding: 20rpx 0;
      text-align: center;
      
      text {
        font-size: 28rpx;
        color: #333;
        
        &.active {
          color: #007AFF;
        }
      }
    }
  }
}

.placeholder {
  color: #999;
}

.picker-view-wrapper {
  background-color: #fff;
  
  .picker-view {
    width: 100%;
    height: 400rpx;
    
    .item {
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
      color: #333;
    }
  }
  
  .picker-actions {
    display: flex;
    padding: 20rpx;
    border-top: 1rpx solid #eee;
    
    button {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      margin: 0 10rpx;
      font-size: 28rpx;
      border-radius: 40rpx;
      
      &.cancel-btn {
        background: #f5f5f5;
        color: #666;
      }
      
      &.confirm-btn {
        background: #007AFF;
        color: #fff;
      }
    }
  }
}

.cost-tip {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #666;
  padding-left: 10rpx;
}

.penalty-section {
  margin-top: 30rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;

  .penalty-title {
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;

    text {
      font-size: 28rpx;
      color: #333;

      &.penalty-tip {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.upload-box {
  width: 200rpx;
  height: 200rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .upload-icon {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 12rpx;
  }
  
  .upload-text {
    font-size: 24rpx;
    color: #999;
  }
}

.image-preview {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  
  .preview-image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
  }
  
  .delete-btn {
    position: absolute;
    top: -20rpx;
    right: -20rpx;
    width: 40rpx;
    height: 40rpx;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .delete-icon {
      width: 24rpx;
      height: 24rpx;
    }
  }
}
</style> 