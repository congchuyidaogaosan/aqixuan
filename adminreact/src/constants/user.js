// src/constants/user.js
// 用户状态常量
export const USER_STATUS = {
    DISABLED: 0,  // 禁用
    NORMAL: 1,    // 正常
  };
  
  // 用户性别常量
  export const USER_GENDER = {
    UNKNOWN: 0,   // 未知
    MALE: 1,      // 男
    FEMALE: 2,    // 女
  };
  
  // 获取用户状态标签配置
  export const getUserStatusTag = (status) => {
    const statusMap = {
      [USER_STATUS.NORMAL]: { color: 'green', text: '正常' },
      [USER_STATUS.DISABLED]: { color: 'red', text: '禁用' },
    };
    
    return statusMap[status] || { color: 'default', text: '未知' };
  };
  
  // 获取用户性别文本
  export const getUserGenderText = (gender) => {
    const genderMap = {
      [USER_GENDER.UNKNOWN]: '未知',
      [USER_GENDER.MALE]: '男',
      [USER_GENDER.FEMALE]: '女',
    };
    
    return genderMap[gender] || '未知';
  };