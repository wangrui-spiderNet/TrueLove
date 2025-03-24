<template>
  <view class="user-page">
    <!-- 用户信息区域 -->
    <view class="user-header">
      <view class="user-info">
        <image class="user-avatar" :src="userInfo.avatar || defaultAvatar" mode="aspectFill"></image>
        <view class="user-detail">
          <text class="user-name">{{ userInfo.username || '用户' }}</text>
          <view class="user-meta">
            <text class="user-meta__item">{{ getGenderText(userInfo.gender) }}</text>
            <text class="user-meta__divider">|</text>
            <text class="user-meta__item">{{ userInfo.age }}岁</text>
          </view>
        </view>
        <view class="user-edit" @tap="handleEditProfile">
          <text class="user-edit__text">编辑</text>
        </view>
      </view>
      
      <!-- 数据卡片 -->
      <view class="user-stats">
        <view class="user-stats__item" @tap="navigateTo('/pages/test/history')">
          <text class="user-stats__value">{{ userStats.testCount }}</text>
          <text class="user-stats__label">测评次数</text>
        </view>
        <view class="user-stats__divider"></view>
        <view class="user-stats__item" @tap="navigateTo('/pages/career/favorite')">
          <text class="user-stats__value">{{ userStats.favoriteCount }}</text>
          <text class="user-stats__label">收藏职业</text>
        </view>
        <view class="user-stats__divider"></view>
        <view class="user-stats__item" @tap="navigateTo('/pages/plan/list')">
          <text class="user-stats__value">{{ userStats.planCount }}</text>
          <text class="user-stats__label">成长计划</text>
        </view>
      </view>
    </view>
    
    <!-- 功能区域 -->
    <view class="user-content">
      <!-- 最近测评 -->
      <view class="user-section" v-if="recentTests.length > 0">
        <view class="user-section__header">
          <text class="user-section__title">最近测评</text>
          <text class="user-section__more" @tap="navigateTo('/pages/test/history')">查看全部</text>
        </view>
        
        <view class="user-tests">
          <view 
            v-for="test in recentTests" 
            :key="test.id"
            class="user-test-item"
            @tap="navigateTo(`/pages/test/result?id=${test.id}`)"
          >
            <text class="user-test-item__title">{{ test.title }}</text>
            <view class="user-test-item__meta">
              <text class="user-test-item__time">{{ formatDate(test.date) }}</text>
              <text class="user-test-item__status">已完成</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 功能入口 -->
      <view class="user-menus">
        <view class="user-menu-group">
          <view class="user-menu-item" @tap="navigateTo('/pages/test/list')">
            <view class="user-menu-item__icon user-menu-item__icon--test"></view>
            <text class="user-menu-item__text">我的测评</text>
            <text class="user-menu-item__arrow">></text>
          </view>
          <view class="user-menu-item" @tap="navigateTo('/pages/career/favorite')">
            <view class="user-menu-item__icon user-menu-item__icon--favorite"></view>
            <text class="user-menu-item__text">收藏职业</text>
            <text class="user-menu-item__arrow">></text>
          </view>
          <view class="user-menu-item" @tap="navigateTo('/pages/plan/list')">
            <view class="user-menu-item__icon user-menu-item__icon--plan"></view>
            <text class="user-menu-item__text">成长计划</text>
            <text class="user-menu-item__arrow">></text>
          </view>
        </view>
        
        <view class="user-menu-group">
          <view class="user-menu-item" @tap="navigateTo('/pages/community/index')">
            <view class="user-menu-item__icon user-menu-item__icon--community"></view>
            <text class="user-menu-item__text">职业社区</text>
            <text class="user-menu-item__arrow">></text>
          </view>
          <view class="user-menu-item" @tap="navigateTo('/pages/mentor/index')">
            <view class="user-menu-item__icon user-menu-item__icon--mentor"></view>
            <text class="user-menu-item__text">职场导师</text>
            <text class="user-menu-item__arrow">></text>
          </view>
        </view>
        
        <view class="user-menu-group">
          <view class="user-menu-item" @tap="navigateTo('/pages/setting/index')">
            <view class="user-menu-item__icon user-menu-item__icon--setting"></view>
            <text class="user-menu-item__text">设置</text>
            <text class="user-menu-item__arrow">></text>
          </view>
          <view class="user-menu-item" @tap="navigateTo('/pages/about/index')">
            <view class="user-menu-item__icon user-menu-item__icon--about"></view>
            <text class="user-menu-item__text">关于我们</text>
            <text class="user-menu-item__arrow">></text>
          </view>
          <view class="user-menu-item" @tap="handleLogout">
            <view class="user-menu-item__icon user-menu-item__icon--logout"></view>
            <text class="user-menu-item__text">退出登录</text>
            <text class="user-menu-item__arrow">></text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { UserService, TestService } from '../../api';

// 用户信息
const userInfo = reactive<any>({});
const defaultAvatar = '../../assets/images/default-avatar.png';

// 用户统计数据
const userStats = reactive({
  testCount: 0,
  favoriteCount: 0,
  planCount: 0
});

// 最近测评
const recentTests = ref<any[]>([]);

// 获取用户信息
const getUserInfo = () => {
  try {
    const userInfoStr = uni.getStorageSync('userInfo');
    if (userInfoStr) {
      Object.assign(userInfo, JSON.parse(userInfoStr));
    } else {
      checkLogin();
    }
  } catch (error) {
    console.error('获取用户信息失败', error);
    checkLogin();
  }
};

// 检查登录状态
const checkLogin = () => {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.redirectTo({
      url: '/pages/login/index'
    });
  }
};

// 获取用户统计数据
const getUserStats = async () => {
  try {
    const result = await UserService.getUserStats();
    Object.assign(userStats, result.data);
  } catch (error) {
    console.error('获取用户统计数据失败', error);
  }
};

// 获取最近测评
const getRecentTests = async () => {
  try {
    const result = await TestService.getRecentTests(3); // 获取最近3条测评记录
    recentTests.value = result.data;
  } catch (error) {
    console.error('获取最近测评失败', error);
  }
};

// 处理编辑个人资料
const handleEditProfile = () => {
  uni.navigateTo({
    url: '/pages/user/edit'
  });
};

// 处理退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除本地存储
        uni.removeStorageSync('token');
        uni.removeStorageSync('userInfo');
        
        // 跳转到登录页
        uni.reLaunch({
          url: '/pages/login/index'
        });
      }
    }
  });
};

// 导航到指定页面
const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};

// 格式化日期
const formatDate = (date: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
};

// 补零
const padZero = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

// 获取性别文本
const getGenderText = (gender: number) => {
  return gender === 1 ? '男' : '女';
};

onMounted(() => {
  getUserInfo();
  getUserStats();
  getRecentTests();
});
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.user-page {
  min-height: 100vh;
  background-color: $bg-color-page;
}

.user-header {
  background-color: $primary-color;
  padding: 60rpx 30rpx 80rpx;
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
  margin-bottom: -50rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: 30rpx;
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: $font-size-xlarge;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16rpx;
}

.user-meta {
  display: flex;
  align-items: center;
  
  &__item {
    font-size: $font-size-small;
    color: rgba(255, 255, 255, 0.8);
  }
  
  &__divider {
    margin: 0 16rpx;
    color: rgba(255, 255, 255, 0.5);
  }
}

.user-edit {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: $border-radius-medium;
  padding: 10rpx 20rpx;
  
  &__text {
    font-size: $font-size-small;
    color: #fff;
  }
}

.user-stats {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  border-radius: $border-radius-large;
  box-shadow: $shadow-base;
  padding: 30rpx 0;
  
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  
  &__value {
    font-size: $font-size-xlarge;
    font-weight: bold;
    color: $text-color-primary;
    margin-bottom: 10rpx;
  }
  
  &__label {
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
  
  &__divider {
    width: 2rpx;
    height: 60rpx;
    background-color: $border-color-light;
  }
}

.user-content {
  padding: 80rpx 30rpx 40rpx;
}

.user-section {
  margin-bottom: 40rpx;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  &__title {
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-color-primary;
  }
  
  &__more {
    font-size: $font-size-small;
    color: $primary-color;
  }
}

.user-tests {
  background-color: #fff;
  border-radius: $border-radius-medium;
  overflow: hidden;
  box-shadow: $shadow-light;
}

.user-test-item {
  padding: 24rpx;
  border-bottom: 2rpx solid $border-color-light;
  
  &:last-child {
    border-bottom: none;
  }
  
  &__title {
    font-size: $font-size-medium;
    color: $text-color-primary;
    margin-bottom: 16rpx;
  }
  
  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__time {
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
  
  &__status {
    font-size: $font-size-small;
    color: $success-color;
  }
}

.user-menus {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.user-menu-group {
  background-color: #fff;
  border-radius: $border-radius-medium;
  overflow: hidden;
  box-shadow: $shadow-light;
}

.user-menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 24rpx;
  border-bottom: 2rpx solid $border-color-light;
  
  &:last-child {
    border-bottom: none;
  }
  
  &__icon {
    width: 48rpx;
    height: 48rpx;
    margin-right: 20rpx;
    background-size: cover;
    background-position: center;
    
    &--test {
      background-color: rgba($primary-color, 0.1);
      border-radius: 50%;
    }
    
    &--favorite {
      background-color: rgba($success-color, 0.1);
      border-radius: 50%;
    }
    
    &--plan {
      background-color: rgba($warning-color, 0.1);
      border-radius: 50%;
    }
    
    &--community {
      background-color: rgba($info-color, 0.1);
      border-radius: 50%;
    }
    
    &--mentor {
      background-color: rgba($primary-color, 0.1);
      border-radius: 50%;
    }
    
    &--setting {
      background-color: rgba($text-color-secondary, 0.1);
      border-radius: 50%;
    }
    
    &--about {
      background-color: rgba($success-color, 0.1);
      border-radius: 50%;
    }
    
    &--logout {
      background-color: rgba($error-color, 0.1);
      border-radius: 50%;
    }
  }
  
  &__text {
    flex: 1;
    font-size: $font-size-medium;
    color: $text-color-primary;
  }
  
  &__arrow {
    font-size: $font-size-medium;
    color: $text-color-secondary;
  }
}
</style> 