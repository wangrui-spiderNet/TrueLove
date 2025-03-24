<template>
  <view class="career-page">
    <!-- 头部信息 -->
    <view class="career-header">
      <view class="career-header__top">
        <image 
          class="career-header__back" 
          src="../../assets/images/icon-back.png" 
          mode="aspectFit"
          @tap="handleBack"
        ></image>
        <text class="career-header__title">职业详情</text>
      </view>
      
      <view class="career-basic">
        <image class="career-basic__icon" :src="careerInfo.icon" mode="aspectFit"></image>
        <view class="career-basic__info">
          <text class="career-basic__name">{{ careerInfo.title }}</text>
          <view class="career-basic__tags">
            <tl-tag 
              v-for="(tag, index) in careerInfo.tags" 
              :key="index"
              size="small"
              :type="getTagType(index)"
            >
              {{ tag }}
            </tl-tag>
          </view>
        </view>
        <view v-if="careerInfo.matchRate" class="career-basic__match">
          <text class="career-basic__match-text">匹配度</text>
          <text class="career-basic__match-value">{{ careerInfo.matchRate }}%</text>
        </view>
      </view>
    </view>
    
    <!-- 职业信息卡片 -->
    <view class="career-cards">
      <!-- 基本信息卡片 -->
      <tl-card class="career-card" shadow="always">
        <view class="career-card__header">
          <text class="career-card__title">基本信息</text>
        </view>
        <view class="career-card__content">
          <view class="career-data-item">
            <text class="career-data-item__label">薪资范围</text>
            <text class="career-data-item__value">{{ careerInfo.salaryCN }}</text>
          </view>
          <view class="career-data-item">
            <text class="career-data-item__label">就业领域</text>
            <text class="career-data-item__value">{{ careerInfo.field }}</text>
          </view>
          <view class="career-data-item">
            <text class="career-data-item__label">工作强度</text>
            <view class="career-data-item__progress">
              <tl-progress 
                :percentage="careerInfo.workload * 20" 
                :stroke-width="12"
                :show-text="false"
              ></tl-progress>
              <text class="career-data-item__level">{{ getWorkloadText(careerInfo.workload) }}</text>
            </view>
          </view>
          <view class="career-data-item">
            <text class="career-data-item__label">入行难度</text>
            <view class="career-data-item__progress">
              <tl-progress 
                :percentage="careerInfo.difficulty * 20" 
                :stroke-width="12"
                :show-text="false"
                type="warning"
              ></tl-progress>
              <text class="career-data-item__level">{{ getDifficultyText(careerInfo.difficulty) }}</text>
            </view>
          </view>
        </view>
      </tl-card>
      
      <!-- 职业描述卡片 -->
      <tl-card class="career-card" shadow="always">
        <view class="career-card__header">
          <text class="career-card__title">职业描述</text>
        </view>
        <view class="career-card__content">
          <text class="career-description">{{ careerInfo.description }}</text>
        </view>
      </tl-card>
      
      <!-- 技能要求卡片 -->
      <tl-card class="career-card" shadow="always">
        <view class="career-card__header">
          <text class="career-card__title">技能要求</text>
        </view>
        <view class="career-card__content">
          <view 
            v-for="(skill, index) in careerInfo.skills" 
            :key="index"
            class="career-skill-item"
          >
            <text class="career-skill-item__name">{{ skill.name }}</text>
            <tl-progress 
              :percentage="skill.level * 20" 
              :type="getSkillType(skill.level)"
              :format="() => getSkillLevelText(skill.level)"
            ></tl-progress>
          </view>
        </view>
      </tl-card>
      
      <!-- 发展路径卡片 -->
      <tl-card class="career-card" shadow="always">
        <view class="career-card__header">
          <text class="career-card__title">发展路径</text>
        </view>
        <view class="career-card__content">
          <view class="career-path">
            <view 
              v-for="(path, index) in careerInfo.paths" 
              :key="index"
              class="career-path-item"
            >
              <view class="career-path-item__dot"></view>
              <view class="career-path-item__line" v-if="index !== careerInfo.paths.length - 1"></view>
              <view class="career-path-item__content">
                <text class="career-path-item__title">{{ path.title }}</text>
                <text class="career-path-item__time">{{ path.time }}</text>
                <text class="career-path-item__desc">{{ path.description }}</text>
              </view>
            </view>
          </view>
        </view>
      </tl-card>
    </view>
    
    <!-- 底部操作区 -->
    <view class="career-actions">
      <tl-button 
        type="default" 
        size="medium"
        @click="handleAddFavorite"
      >
        {{ isFavorite ? '取消收藏' : '收藏职业' }}
      </tl-button>
      
      <tl-button 
        type="primary" 
        size="medium"
        @click="handleCreatePlan"
      >
        创建成长计划
      </tl-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import TlCard from '../../components/TlCard.vue';
import TlTag from '../../components/TlTag.vue';
import TlProgress from '../../components/TlProgress.vue';
import TlButton from '../../components/TlButton.vue';
import { CareerService } from '../../api';

// 页面参数
const careerId = ref('');

// 职业信息
const careerInfo = reactive<any>({
  id: '',
  title: '',
  icon: '',
  tags: [],
  matchRate: 0,
  salaryCN: '',
  field: '',
  workload: 3,
  difficulty: 3,
  description: '',
  skills: [],
  paths: []
});

// 是否已收藏
const isFavorite = ref(false);

// 初始化
const init = async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  // @ts-ignore
  const options = currentPage.$page?.options;
  
  if (options && options.id) {
    careerId.value = options.id;
    await loadCareerInfo();
    checkIsFavorite();
  } else {
    uni.showToast({
      title: '缺少职业ID',
      icon: 'none'
    });
    uni.navigateBack();
  }
};

// 加载职业信息
const loadCareerInfo = async () => {
  try {
    const result = await CareerService.getCareerDetail(careerId.value);
    Object.assign(careerInfo, result.data);
  } catch (error) {
    console.error('获取职业信息失败', error);
    uni.showToast({
      title: '获取职业信息失败',
      icon: 'none'
    });
  }
};

// 检查是否已收藏
const checkIsFavorite = async () => {
  try {
    const result = await CareerService.checkIsFavorite(careerId.value);
    isFavorite.value = result.data.isFavorite;
  } catch (error) {
    console.error('检查收藏状态失败', error);
  }
};

// 处理返回
const handleBack = () => {
  uni.navigateBack();
};

// 处理添加收藏
const handleAddFavorite = async () => {
  try {
    if (isFavorite.value) {
      await CareerService.removeFavorite(careerId.value);
      isFavorite.value = false;
      uni.showToast({
        title: '已取消收藏',
        icon: 'success'
      });
    } else {
      await CareerService.addFavorite(careerId.value);
      isFavorite.value = true;
      uni.showToast({
        title: '已加入收藏',
        icon: 'success'
      });
    }
  } catch (error) {
    console.error('操作收藏失败', error);
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

// 处理创建成长计划
const handleCreatePlan = () => {
  uni.navigateTo({
    url: `/pages/plan/create?careerId=${careerId.value}`
  });
};

// 获取标签类型
const getTagType = (index: number) => {
  const types = ['primary', 'success', 'warning', 'info'];
  return types[index % types.length];
};

// 获取工作强度文本
const getWorkloadText = (level: number) => {
  const levels = ['非常轻松', '较为轻松', '一般', '较为繁重', '非常繁重'];
  return levels[level - 1] || '未知';
};

// 获取入行难度文本
const getDifficultyText = (level: number) => {
  const levels = ['非常简单', '较为简单', '一般', '较为困难', '非常困难'];
  return levels[level - 1] || '未知';
};

// 获取技能类型
const getSkillType = (level: number) => {
  if (level >= 4) return 'success';
  if (level >= 2) return 'primary';
  return 'warning';
};

// 获取技能级别文本
const getSkillLevelText = (level: number) => {
  const levels = ['入门', '基础', '熟练', '精通', '专家'];
  return levels[level - 1] || '未知';
};

onMounted(() => {
  init();
});
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.career-page {
  min-height: 100vh;
  padding-bottom: 150rpx;
  background-color: $bg-color-page;
}

.career-header {
  background-color: $primary-color;
  padding: 40rpx 30rpx 60rpx;
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
  margin-bottom: 30rpx;
  
  &__top {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
  }
  
  &__back {
    width: 48rpx;
    height: 48rpx;
    margin-right: 20rpx;
  }
  
  &__title {
    flex: 1;
    text-align: center;
    font-size: $font-size-large;
    font-weight: 500;
    color: #fff;
    margin-right: 68rpx;
  }
}

.career-basic {
  display: flex;
  align-items: center;
  
  &__icon {
    width: 100rpx;
    height: 100rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 16rpx;
    margin-right: 20rpx;
  }
  
  &__info {
    flex: 1;
  }
  
  &__name {
    font-size: $font-size-xlarge;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
  }
  
  &__match {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: $border-radius-medium;
    padding: 12rpx 16rpx;
  }
  
  &__match-text {
    font-size: $font-size-small;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 6rpx;
  }
  
  &__match-value {
    font-size: $font-size-medium;
    font-weight: bold;
    color: #fff;
  }
}

.career-cards {
  padding: 0 30rpx;
}

.career-card {
  margin-bottom: 30rpx;
  
  &__header {
    margin-bottom: 20rpx;
  }
  
  &__title {
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-color-primary;
    position: relative;
    padding-left: 20rpx;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 24rpx;
      background-color: $primary-color;
      border-radius: 3rpx;
    }
  }
}

.career-data-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &__label {
    width: 160rpx;
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
  
  &__value {
    font-size: $font-size-small;
    color: $text-color-primary;
  }
  
  &__progress {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  &__level {
    font-size: $font-size-small;
    color: $text-color-primary;
    margin-left: 20rpx;
    width: 120rpx;
  }
}

.career-description {
  font-size: $font-size-small;
  color: $text-color-regular;
  line-height: 1.6;
}

.career-skill-item {
  margin-bottom: 24rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &__name {
    font-size: $font-size-small;
    color: $text-color-primary;
    margin-bottom: 12rpx;
  }
}

.career-path {
  position: relative;
}

.career-path-item {
  position: relative;
  padding-left: 40rpx;
  margin-bottom: 40rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &__dot {
    position: absolute;
    left: 0;
    top: 16rpx;
    width: 20rpx;
    height: 20rpx;
    background-color: $primary-color;
    border-radius: 50%;
  }
  
  &__line {
    position: absolute;
    left: 10rpx;
    top: 36rpx;
    width: 2rpx;
    height: calc(100% + 24rpx);
    background-color: $border-color;
  }
  
  &__content {
    position: relative;
  }
  
  &__title {
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-color-primary;
    margin-bottom: 10rpx;
  }
  
  &__time {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-bottom: 16rpx;
  }
  
  &__desc {
    font-size: $font-size-small;
    color: $text-color-regular;
    line-height: 1.6;
  }
}

.career-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style> 