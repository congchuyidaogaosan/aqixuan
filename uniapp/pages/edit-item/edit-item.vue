<template>
  <view class="edit-item-container">
    <!-- 输入框模式 -->
    <template v-if="mode === 'input'">
      <input 
        class="input"
        v-model="inputValue"
        :placeholder="placeholder"
        maxlength="20"
      />
    </template>
    
    <!-- 文本框模式 -->
    <template v-else-if="mode === 'textarea'">
      <textarea 
        class="textarea"
        v-model="inputValue"
        :placeholder="placeholder"
        maxlength="200"
        :show-count="true"
        :auto-height="true"
      />
    </template>
    
    <!-- 地区选择模式 -->
    <template v-else-if="mode === 'location'">
      <view class="region-picker-container">
        <picker-view 
          class="picker-view"
          :value="regionIndexes"
          @change="handleRegionChange"
          indicator-style="height: 80rpx;"
        >
          <picker-view-column>
            <view class="picker-item" v-for="(item, index) in provinceList" :key="index">
              {{item.label}}
            </view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(item, index) in cityList" :key="index">
              {{item.label}}
            </view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(item, index) in districtList" :key="index">
              {{item.label}}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </template>
    
    <!-- 日期选择模式 -->
    <template v-else-if="mode === 'date'">
      <view class="date-picker-container">
        <picker-view 
          class="picker-view"
          :value="dateIndexes"
          @change="handleDateChange"
          indicator-style="height: 80rpx;"
        >
          <picker-view-column>
            <view class="picker-item" v-for="year in yearList" :key="year">{{year}}年</view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="month in 12" :key="month">{{month}}月</view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="day in dayList" :key="day">{{day}}日</view>
          </picker-view-column>
        </picker-view>
      </view>
    </template>
    
    <!-- 单选列表模式 -->
    <template v-else-if="mode === 'select' && !multiple">
      <view class="option-list">
        <view 
          class="option-item"
          v-for="(item, index) in options"
          :key="index"
          :class="{ active: selectedValue === item }"
          @click="handleSelect(item)"
        >
          <text>{{item}}</text>
          <uni-icons v-if="selectedValue === item" type="checkmarkempty" size="20" color="#ff4d4f"></uni-icons>
        </view>
      </view>
    </template>
    
    <!-- 多选列表模式 -->
    <template v-else-if="mode === 'select' && multiple">
      <view class="option-list">
        <view 
          class="option-item"
          v-for="(item, index) in options"
          :key="index"
          :class="{ active: selectedValues.includes(item) }"
          @click="handleMultiSelect(item)"
        >
          <text>{{item}}</text>
          <uni-icons v-if="selectedValues.includes(item)" type="checkmarkempty" size="20" color="#ff4d4f"></uni-icons>
        </view>
      </view>
    </template>
    
    <!-- 完成按钮 -->
    <view class="submit-btn" @click="handleSubmit">完成</view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import cityData from '@/common/city.js'
import { updateUser } from '@/api/user'

const mode = ref('select')
const multiple = ref(false)
const options = ref([])
const inputValue = ref('')
const selectedValue = ref('')
const selectedValues = ref([])
const selectedRegion = ref([])
const placeholder = ref('')

// 日期范围计算
const currentYear = new Date().getFullYear()
const endYear = currentYear - 15  // 截止到15年前
const startYear = endYear - 100   // 开始于100年前

// 年份列表计算
const yearList = computed(() => {
  const years = []
  for (let i = startYear; i <= endYear; i++) {
    years.push(i)
  }
  return years
})

// 根据年月计算天数
const dayList = computed(() => {
  const year = yearList.value[dateIndexes.value[0]]
  const month = dateIndexes.value[1] + 1
  const days = new Date(year, month, 0).getDate()
  return Array.from({length: days}, (_, i) => i + 1)
})

// 地区选择相关
const regionIndexes = ref([0, 0, 0])

// 省份列表
const provinceList = computed(() => {
  console.log('省份列表:', cityData.data)
  return cityData.data
})

// 城市列表
const cityList = computed(() => {
  const province = provinceList.value[regionIndexes.value[0]]
  console.log('当前省份:', province)
  return province ? province.children : []
})

// 区县列表
const districtList = computed(() => {
  const city = cityList.value[regionIndexes.value[1]]
  console.log('当前城市:', city)
  return city ? city.children : []
})

// 日期选择相关
const dateIndexes = ref([20, 0, 0]) // 默认选中1990年

// 获取页面参数
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const { type, value, list, isMultiple, mode: pageMode, title } = currentPage.$page.options
  
  // 设置页面标题
  uni.setNavigationBarTitle({ title: decodeURIComponent(title) })
  
  mode.value = pageMode
  multiple.value = isMultiple === 'true'
  
  if (list) {
    options.value = JSON.parse(decodeURIComponent(list))
  }
  
  try {
    console.log('原始value:', value)
    const decodedValue = value ? JSON.parse(decodeURIComponent(value)) : ''
    console.log('解析后的value:', decodedValue)
    
    switch (mode.value) {
      case 'input':
      case 'textarea':
        inputValue.value = decodedValue
        placeholder.value = getPlaceholder(type)
        break
      case 'date':
        if (decodedValue) {
          inputValue.value = decodedValue
          const [year, month, day] = decodedValue.split('-')
          dateIndexes.value = [
            yearList.value.indexOf(parseInt(year)),
            parseInt(month) - 1,
            parseInt(day) - 1
          ]
        } else {
          // 设置默认日期为2000-01-01
          const defaultYear = 2000
          const yearIndex = yearList.value.indexOf(defaultYear)
          dateIndexes.value = [
            yearIndex >= 0 ? yearIndex : 0,
            0,
            0
          ]
          inputValue.value = `${defaultYear}-01-01`
        }
        break
      case 'location':
        // 如果是字符串，先转换为数组
        if (typeof decodedValue === 'string' && decodedValue) {
          selectedRegion.value = decodedValue.split(' ')
        } else {
          selectedRegion.value = decodedValue || []
        }
        
        if (selectedRegion.value.length === 3) {
          // 初始化索引
          const provinceIndex = provinceList.value.findIndex(p => p.label === selectedRegion.value[0])
          if (provinceIndex >= 0) {
            regionIndexes.value[0] = provinceIndex
            
            // 等待城市列表更新
            nextTick(() => {
              const cityIndex = cityList.value.findIndex(c => c.label === selectedRegion.value[1])
              if (cityIndex >= 0) {
                regionIndexes.value[1] = cityIndex
                
                // 等待区县列表更新
                nextTick(() => {
                  const districtIndex = districtList.value.findIndex(d => d.label === selectedRegion.value[2])
                  if (districtIndex >= 0) {
                    regionIndexes.value[2] = districtIndex
                  }
                })
              }
            })
          }
        } else {
          // 设置默认值
          regionIndexes.value = [0, 0, 0]
          nextTick(() => {
            const province = provinceList.value[0]
            const city = province?.children?.[0]
            const district = city?.children?.[0]
            if (province && city && district) {
              selectedRegion.value = [province.label, city.label, district.label]
            }
          })
        }
        break
      case 'select':
        if (multiple.value) {
          // 如果是多选且有值，将顿号分隔的字符串转回数组
          selectedValues.value = decodedValue ? (typeof decodedValue === 'string' ? decodedValue.split('、') : decodedValue) : []
          console.log('多选值:', selectedValues.value)
        } else {
          selectedValue.value = decodedValue
          console.log('单选值:', selectedValue.value)
        }
        break
    }
  } catch (error) {
    console.error('解析value出错:', error)
  }
})

// 获取placeholder
const getPlaceholder = (type) => {
  const placeholders = {
    nickname: '请输入昵称',
    bio: '介绍一下自己吧'
  }
  return placeholders[type]
}

// 单选处理
const handleSelect = (value) => {
  selectedValue.value = value
}

// 多选处理
const handleMultiSelect = (value) => {
  const index = selectedValues.value.indexOf(value)
  if (index > -1) {
    selectedValues.value.splice(index, 1)
  } else {
    selectedValues.value.push(value)
  }
}

// 处理地区选择
const handleRegionChange = (e) => {
  const values = e.detail.value
  console.log('选择的索引:', values)
  
  // 如果省份改变，重置市和区
  if (values[0] !== regionIndexes.value[0]) {
    values[1] = 0
    values[2] = 0
  }
  // 如果城市改变，重置区
  else if (values[1] !== regionIndexes.value[1]) {
    values[2] = 0
  }
  
  regionIndexes.value = values
  
  const province = provinceList.value[values[0]]
  const city = cityList.value[values[1]]
  const district = districtList.value[values[2]]
  
  if (province && city && district) {
    selectedRegion.value = [
      province.label,
      city.label,
      district.label
    ]
    console.log('选择的地区:', selectedRegion.value)
  }
}

// 处理日期选择
const handleDateChange = (e) => {
  const values = e.detail.value
  dateIndexes.value = values
  
  const year = yearList.value[values[0]]
  const month = String(values[1] + 1).padStart(2, '0')
  const day = String(values[2] + 1).padStart(2, '0')
  
  inputValue.value = `${year}-${month}-${day}`
}

// 提交函数
const handleSubmit = async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const { type } = currentPage.$page.options || currentPage.options
  
  let value
  switch (mode.value) {
    case 'input':
    case 'textarea':
    case 'date':
      value = inputValue.value
      break
    case 'location':
      // 将地区数组转换为字符串
      value = selectedRegion.value.join(' ')
      break
    case 'select':
      if (multiple.value) {
        value = selectedValues.value.join('、')
      } else {
        value = selectedValue.value
      }
      break
  }
  
  try {
    uni.showLoading({ title: '保存中...' })
    
    // 调用更新接口
    const res = await updateUser({ [type]: value })
    console.log(res)
    
    // 保存到本地
    const userInfo = uni.getStorageSync('userInfo') || {}
    userInfo[type] = value
    uni.setStorageSync('userInfo', userInfo)
    
    // 触发更新事件
    uni.$emit('updateUserInfo')
    
    uni.hideLoading()
    // 返回上一页
    // uni.navigateBack(1);
    // uni.navigateBack()
	uni.navigateBack(1);

  } catch (error) {
    console.error('保存失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="less" scoped>
.edit-item-container {
  padding: 30rpx;
  
  .input {
    height: 80rpx;
    background: #f8f8f8;
    border-radius: 40rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
  }
  
  .textarea {
    width: 100%;
    min-height: 160rpx;
    max-height: 400rpx;
    background: #f8f8f8;
    border-radius: 20rpx;
    padding: 20rpx;
    font-size: 28rpx;
    box-sizing: border-box;
    line-height: 1.5;
  }
  
  .option-list {
    .option-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      padding: 0 30rpx;
      background: #fff;
      border-bottom: 1rpx solid #eee;
      
      &.active {
        color: #ff4d4f;
      }
    }
  }
  
  .submit-btn {
    position: fixed;
    bottom: 40rpx;
    left: 30rpx;
    right: 30rpx;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    background: #ff4d4f;
    color: #fff;
    border-radius: 45rpx;
    font-size: 32rpx;
  }
  
  .picker-view-container {
    height: 600rpx;
    
    .picker-view {
      width: 100%;
      height: 100%;
      
      .picker-item {
        line-height: 80rpx;
        text-align: center;
      }
    }
  }
  
  .date-picker-container {
    height: 600rpx;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    
    .picker-view {
      width: 100%;
      height: 100%;
    }
    
    .picker-item {
      line-height: 80rpx;
      text-align: center;
    }
  }
  
  .region-picker-container {
    height: 600rpx;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    
    .picker-view {
      width: 100%;
      height: 100%;
    }
    
    .picker-item {
      line-height: 80rpx;
      text-align: center;
    }
  }
}
</style> 