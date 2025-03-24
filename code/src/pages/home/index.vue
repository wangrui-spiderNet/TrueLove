<template>
  <view class="home-page">
    <!-- 顶部区域 -->
    <view class="home-header">
      <view class="home-welcome">
        <text class="home-welcome__text">欢迎，{{ userInfo.username || '用户' }}</text>
        <text class="home-welcome__tip">探索你的真爱职业</text>
      </view>
      <view class="home-avatar" @tap="handleUserCenter">
        <image class="home-avatar__img" :src="userInfo.avatar || defaultAvatar" mode="aspectFill"></image>
      </view>
    </view>
    
    <!-- 搜索区域 -->
    <view class="home-search">
      <tl-input
        v-model="searchText"
        placeholder="搜索职业、测评或课程"
        prefixIcon="icon-search"
        clearable
        @confirm="handleSearch"
      ></tl-input>
    </view>
    
    <!-- 测评区域 -->
    <view class="home-section">
      <view class="home-section__header">
        <text class="home-section__title">职业测评</text>
        <text class="home-section__more" @tap="handleMoreTests">查看全部</text>
      </view>
      
      <scroll-view class="home-test-scroll" scroll-x>
        <view class="home-test-list">
          <view 
            class="home-test-item" 
            v-for="test in testList" 
            :key="test.id"
            @tap="handleStartTest(test.id)"
          >
            <image class="home-test-item__image" :src="test.coverImage" mode="aspectFill"></image>
            <view class="home-test-item__content">
              <text class="home-test-item__title">{{ test.title }}</text>
              <text class="home-test-item__desc">{{ test.description }}</text>
              <view class="home-test-item__footer">
                <text class="home-test-item__count">{{ test.questionCount }}题</text>
                <text class="home-test-item__duration">约{{ test.duration }}分钟</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 职业推荐区域 -->
    <view class="home-section">
      <view class="home-section__header">
        <text class="home-section__title">职业推荐</text>
        <text class="home-section__more" @tap="handleMoreCareers">查看全部</text>
      </view>
      
      <view class="home-career-list">
        <view 
          class="home-career-item" 
          v-for="career in careerList" 
          :key="career.id"
          @tap="handleCareerDetail(career.id)"
        >
          <tl-card class="home-career-card" shadow="hover">
            <view class="home-career-card__header">
              <image class="home-career-card__icon" :src="career.icon" mode="aspectFit"></image>
              <text class="home-career-card__title">{{ career.title }}</text>
              <view class="home-career-card__match">
                <text class="home-career-card__match-text">匹配度</text>
                <text class="home-career-card__match-value">{{ career.matchRate }}%</text>
              </view>
            </view>
            <view class="home-career-card__content">
              <view class="home-career-card__item">
                <text class="home-career-card__label">薪资范围</text>
                <text class="home-career-card__value">{{ career.salaryCN }}</text>
              </view>
              <view class="home-career-card__item">
                <text class="home-career-card__label">行业前景</text>
                <view class="home-career-card__tags">
                  <tl-tag 
                    v-for="(tag, index) in career.prospects" 
                    :key="index"
                    size="small"
                    :type="getTagType(index)"
                  >
                    {{ tag }}
                  </tl-tag>
                </view>
              </view>
            </view>
          </tl-card>
        </view>
      </view>
    </view>
    
    <!-- 成长计划区域 -->
    <view class="home-section">
      <view class="home-section__header">
        <text class="home-section__title">成长计划</text>
        <text class="home-section__more" @tap="handleMorePlans">查看全部</text>
      </view>
      
      <view class="home-plan-list">
        <view 
          class="home-plan-item" 
          v-for="plan in planList" 
          :key="plan.id"
          @tap="handlePlanDetail(plan.id)"
        >
          <tl-card class="home-plan-card" shadow="hover">
            <view class="home-plan-card__header">
              <text class="home-plan-card__title">{{ plan.title }}</text>
              <tl-tag :type="getPlanTagType(plan.level)" size="small">{{ getPlanLevelText(plan.level) }}</tl-tag>
            </view>
            <view class="home-plan-card__content">
              <view class="home-plan-card__desc">{{ plan.description }}</view>
              <view class="home-plan-card__progress">
                <tl-progress 
                  :percentage="plan.progress" 
                  :type="getPlanProgressType(plan.progress)"
                ></tl-progress>
              </view>
            </view>
          </tl-card>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import TlInput from '../../components/TlInput.vue';
import TlCard from '../../components/TlCard.vue';
import TlTag from '../../components/TlTag.vue';
import TlProgress from '../../components/TlProgress.vue';
import { TestService, CareerService, GrowthPlanService } from '../../api';

// 用户信息
const userInfo = reactive<any>({});
const defaultAvatar = '../../assets/images/default-avatar.png';

// 搜索
const searchText = ref('');

// 测评列表
const testList = ref<any[]>([]);

// 职业列表
const careerList = ref<any[]>([]);

// 成长计划列表
const planList = ref<any[]>([]);

// 获取用户信息
const getUserInfo = () => {
  try {
    const userInfoStr = uni.getStorageSync('userInfo');
    if (userInfoStr) {
      Object.assign(userInfo, JSON.parse(userInfoStr));
    }
  } catch (error) {
    console.error('获取用户信息失败', error);
  }
};

// 获取测评列表
const getTestList = async () => {
  try {
    const result = await TestService.getRecommendedTests();
    testList.value = result.data;
  } catch (error) {
    console.error('获取测评列表失败', error);
  }
};

// 获取职业列表
const getCareerList = async () => {
  try {
    const result = await CareerService.getRecommendedCareers();
    careerList.value = result.data;
  } catch (error) {
    console.error('获取职业列表失败', error);
  }
};

// 获取成长计划列表
const getPlanList = async () => {
  try {
    const result = await GrowthPlanService.getGrowthPlans();
    planList.value = result.data;
  } catch (error) {
    console.error('获取成长计划列表失败', error);
  }
};

// 处理开始测评
const handleStartTest = (testId: string) => {
  uni.navigateTo({
    url: `/pages/test/index?id=${testId}`
  });
};

// 处理职业详情
const handleCareerDetail = (careerId: string) => {
  uni.navigateTo({
    url: `/pages/career/detail?id=${careerId}`
  });
};

// 处理计划详情
const handlePlanDetail = (planId: string) => {
  uni.navigateTo({
    url: `/pages/plan/detail?id=${planId}`
  });
};

// 处理更多测评
const handleMoreTests = () => {
  uni.navigateTo({
    url: '/pages/test/list'
  });
};

// 处理更多职业
const handleMoreCareers = () => {
  uni.navigateTo({
    url: '/pages/career/list'
  });
};

// 处理更多计划
const handleMorePlans = () => {
  uni.navigateTo({
    url: '/pages/plan/list'
  });
};

// 处理搜索
const handleSearch = () => {
  if (!searchText.value.trim()) {
    uni.showToast({
      title: '请输入搜索内容',
      icon: 'none'
    });
    return;
  }
  
  uni.navigateTo({
    url: `/pages/search/index?keyword=${encodeURIComponent(searchText.value)}`
  });
};

// 处理用户中心
const handleUserCenter = () => {
  uni.navigateTo({
    url: '/pages/user/index'
  });
};

// 获取标签类型
const getTagType = (index: number) => {
  const types = ['primary', 'success', 'warning', 'info'];
  return types[index % types.length];
};

// 获取计划标签类型
const getPlanTagType = (level: number) => {
  const types = ['primary', 'success', 'warning'];
  return types[level - 1] || 'primary';
};

// 获取计划级别文本
const getPlanLevelText = (level: number) => {
  const levels = ['初级', '中级', '高级'];
  return levels[level - 1] || '未知';
};

// 获取计划进度类型
const getPlanProgressType = (progress: number) => {
  if (progress >= 80) return 'success';
  if (progress >= 40) return 'primary';
  return 'warning';
};

onMounted(() => {
  getUserInfo();
  getTestList();
  getCareerList();
  getPlanList();
});
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.home-page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  background-color: $bg-color-page;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.home-welcome {
  display: flex;
  flex-direction: column;
  
  &__text {
    font-size: $font-size-xlarge;
    font-weight: bold;
    color: $text-color-primary;
    margin-bottom: 10rpx;
  }
  
  &__tip {
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
}

.home-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid rgba($primary-color, 0.2);
  
  &__img {
    width: 100%;
    height: 100%;
  }
}

.home-search {
  margin-bottom: 40rpx;
}

.home-section {
  margin-bottom: 50rpx;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
  }
  
  &__title {
    font-size: $font-size-large;
    font-weight: 500;
    color: $text-color-primary;
  }
  
  &__more {
    font-size: $font-size-small;
    color: $primary-color;
  }
}

.home-test-scroll {
  width: 100%;
  white-space: nowrap;
}

.home-test-list {
  display: inline-flex;
  padding: 10rpx 0;
}

.home-test-item {
  display: inline-block;
  width: 500rpx;
  margin-right: 30rpx;
  border-radius: $border-radius-medium;
  background-color: #fff;
  overflow: hidden;
  box-shadow: $shadow-light;
  
  &:last-child {
    margin-right: 30rpx;
  }
  
  &__image {
    width: 100%;
    height: 250rpx;
  }
  
  &__content {
    padding: 24rpx;
  }
  
  &__title {
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-color-primary;
    margin-bottom: 16rpx;
  }
  
  &__desc {
    font-size: $font-size-small;
    color: $text-color-regular;
    margin-bottom: 20rpx;
    height: 80rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }
  
  &__footer {
    display: flex;
    align-items: center;
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
  
  &__count {
    margin-right: 20rpx;
  }
}

.home-career-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.home-career-card {
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  &__icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 16rpx;
  }
  
  &__title {
    flex: 1;
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-color-primary;
  }
  
  &__match {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  &__match-text {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-bottom: 6rpx;
  }
  
  &__match-value {
    font-size: $font-size-medium;
    font-weight: bold;
    color: $primary-color;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
  
  &__item {
    display: flex;
    align-items: center;
  }
  
  &__label {
    width: 150rpx;
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
  
  &__value {
    font-size: $font-size-small;
    color: $text-color-regular;
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
  }
}

.home-plan-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.home-plan-card {
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
  
  &__desc {
    font-size: $font-size-small;
    color: $text-color-regular;
    margin-bottom: 20rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  
  &__progress {
    margin-top: 10rpx;
  }
}
</style> 