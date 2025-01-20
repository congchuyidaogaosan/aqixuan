/**
 * 计算两个坐标点之间的距离
 * @param {Object} point1 第一个坐标点 {latitude, longitude}
 * @param {Object} point2 第二个坐标点 {latitude, longitude}
 * @returns {number} 返回两点之间的距离，单位：米
 */
export const calculateDistance = (point1, point2) => {
  if (!point1 || !point2) return null
  
  // 将经纬度转换为数字
  const lat1 = parseFloat(point1.latitude)
  const lng1 = parseFloat(point1.longitude)
  const lat2 = parseFloat(point2.latitude)
  const lng2 = parseFloat(point2.longitude)
  
  // 地球半径，单位：米
  const EARTH_RADIUS = 6371000
  
  // 将角度转换为弧度
  const toRad = (degree) => {
    return degree * Math.PI / 180
  }
  
  // 计算两点之间的距离
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
           Math.sin(dLng/2) * Math.sin(dLng/2)
           
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  
  // 计算距离，四舍五入到整数
  const distance = Math.round(EARTH_RADIUS * c)
  
  return distance
}

/**
 * 格式化距离显示
 * @param {number} distance 距离，单位：米
 * @returns {string} 格式化后的距离字符串
 */
export const formatDistance = (distance) => {
  if (!distance) return '--'
  
  if (distance < 1000) {
    return `${distance}m`
  } else {
    return `${(distance/1000).toFixed(1)}km`
  }
}

/**
 * 解析位置字符串为坐标对象
 * @param {string} locationStr 格式为"latitude,longitude"的位置字符串
 * @returns {Object|null} 返回坐标对象或null
 */
export const parseLocation = (locationStr) => {
  if (!locationStr) return null
  
  try {
    // 尝试解析JSON格式
    if (locationStr.startsWith('{')) {
      const location = JSON.parse(locationStr)
      if (location.latitude && location.longitude) {
        return {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude)
        }
      }
    }
    
    // 尝试解析逗号分隔的字符串
    const [latitude, longitude] = locationStr.split(',')
    if (!latitude || !longitude) return null
    
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    }
  } catch (error) {
    console.log('解析位置信息失败：', error)
    return null
  }
} 