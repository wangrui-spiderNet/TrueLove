<template>
  <view class="plan-page">
    <!-- 头部信息 -->
    <view class="plan-header">
      <view class="plan-header__top">
        <image 
          class="plan-header__back" 
          src="../../assets/images/icon-back.png" 
          mode="aspectFit"
          @tap="handleBack"
        ></image>
        <text class="plan-header__title">成长计划详情</text>
      </view>
      
      <view class="plan-basic">
        <view class="plan-basic__info">
          <text class="plan-basic__name">{{ planInfo.title }}</text>
          <view class="plan-basic__meta">
            <tl-tag :type="getPlanTagType(planInfo.level)" size="small">{{ getPlanLevelText(planInfo.level) }}</tl-tag>
            <text class="plan-basic__career">{{ planInfo.careerName }}</text>
          </view>
        </view>
      </view>
      
      <view class="plan-progress-box">
        <view class="plan-progress-info">
          <text class="plan-progress-text">总进度</text>
          <text class="plan-progress-value">{{ planInfo.progress }}%</text>
        </view>
        <tl-progress 
          :percentage="planInfo.progress" 
          :type="getPlanProgressType(planInfo.progress)"
        ></tl-progress>
      </view>
    </view>
    
    <!-- 计划内容 -->
    <view class="plan-content">
      <!-- 计划介绍 -->
      <tl-card class="plan-card" shadow="always">
        <view class="plan-card__header">
          <text class="plan-card__title">计划介绍</text>
        </view>
        <view class="plan-card__content">
          <text class="plan-description">{{ planInfo.description }}</text>
        </view>
      </tl-card>
      
      <!-- 学习任务 -->
      <view class="plan-tasks">
        <view class="plan-tasks__header">
          <text class="plan-tasks__title">学习任务</text>
          <text class="plan-tasks__progress">{{ completedTasksCount }}/{{ planInfo.tasks.length }}</text>
        </view>
        
        <view 
          v-for="(stage, stageIndex) in planInfo.stages" 
          :key="stageIndex"
          class="plan-stage"
        >
          <view class="plan-stage__header">
            <view class="plan-stage__info">
              <text class="plan-stage__name">{{ stage.name }}</text>
              <text class="plan-stage__desc">{{ stage.description }}</text>
            </view>
            <view class="plan-stage__progress">
              <text class="plan-stage__progress-text">{{ getStageProgress(stage) }}%</text>
            </view>
          </view>
          
          <view class="plan-task-list">
            <view 
              v-for="(task, taskIndex) in stage.tasks" 
              :key="taskIndex"
              class="plan-task-item"
              :class="{'plan-task-item--completed': task.completed}"
              @tap="handleTaskDetail(task.id)"
            >
              <view class="plan-task-item__checkbox" @tap.stop="handleToggleTask(task.id)">
                <view class="plan-task-item__checkbox-inner" v-if="task.completed"></view>
              </view>
              <view class="plan-task-item__content">
                <text class="plan-task-item__title">{{ task.title }}</text>
                <text class="plan-task-item__desc">{{ task.description }}</text>
                <view class="plan-task-item__meta">
                  <text class="plan-task-item__time">预计耗时：{{ task.duration }}</text>
                  <tl-tag 
                    size="mini" 
                    :type="getTaskTagType(task.type)"
                  >
                    {{ getTaskTypeText(task.type) }}
                  </tl-tag>
                </view>
              </view>
              <text class="plan-task-item__arrow">></text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作区 -->
    <view class="plan-actions">
      <tl-button 
        type="default" 
        size="medium"
        @click="handleShare"
      >
        分享计划
      </tl-button>
      
      <tl-button 
        type="primary" 
        size="medium"
        @click="handleEditPlan"
      >
        编辑计划
      </tl-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import TlCard from '../../components/TlCard.vue';
import TlTag from '../../components/TlTag.vue';
import TlProgress from '../../components/TlProgress.vue';
import TlButton from '../../components/TlButton.vue';
import { GrowthPlanService } from '../../api';

// 页面参数
const planId = ref('');

// 计划信息
const planInfo = reactive<any>({
  id: '',
  title: '',
  description: '',
  careerName: '',
  level: 1,
  progress: 0,
  stages: [],
  tasks: []
});

// 初始化
const init = async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  // @ts-ignore
  const options = currentPage.$page?.options;
  
  if (options && options.id) {
    planId.value = options.id;
    await loadPlanInfo();
  } else {
    uni.showToast({
      title: '缺少计划ID',
      icon: 'none'
    });
    uni.navigateBack();
  }
};

// 加载计划信息
const loadPlanInfo = async () => {
  try {
    const result = await GrowthPlanService.getPlanDetail(planId.value);
    Object.assign(planInfo, result.data);
    
    // 合并所有任务到一个数组，方便计算
    planInfo.tasks = [];
    planInfo.stages.forEach((stage: any) => {
      planInfo.tasks.push(...stage.tasks);
    });
  } catch (error) {
    console.error('获取计划信息失败', error);
    uni.showToast({
      title: '获取计划信息失败',
      icon: 'none'
    });
  }
};

// 获取已完成任务数量
const completedTasksCount = computed(() => {
  if (!planInfo.tasks) return 0;
  return planInfo.tasks.filter((task: any) => task.completed).length;
});

// 获取阶段进度
const getStageProgress = (stage: any) => {
  if (!stage.tasks || stage.tasks.length === 0) return 0;
  const completedCount = stage.tasks.filter((task: any) => task.completed).length;
  return Math.round((completedCount / stage.tasks.length) * 100);
};

// 处理返回
const handleBack = () => {
  uni.navigateBack();
};

// 处理任务详情
const handleTaskDetail = (taskId: string) => {
  uni.navigateTo({
    url: `/pages/task/detail?id=${taskId}&planId=${planId.value}`
  });
};

// 处理切换任务状态
const handleToggleTask = async (taskId: string) => {
  try {
    // 找到对应的任务
    const task = planInfo.tasks.find((t: any) => t.id === taskId);
    if (!task) return;
    
    // 切换状态
    const newStatus = !task.completed;
    
    // 调用API
    await GrowthPlanService.updateTaskStatus(planId.value, taskId, newStatus);
    
    // 更新本地状态
    task.completed = newStatus;
    
    // 更新总进度
    planInfo.progress = Math.round((completedTasksCount.value / planInfo.tasks.length) * 100);
    
    uni.showToast({
      title: newStatus ? '任务已完成' : '任务已重置',
      icon: 'success'
    });
  } catch (error) {
    console.error('更新任务状态失败', error);
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

// 处理分享计划
const handleShare = () => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  });
};

// 处理编辑计划
const handleEditPlan = () => {
  uni.navigateTo({
    url: `/pages/plan/edit?id=${planId.value}`
  });
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

// 获取任务标签类型
const getTaskTagType = (type: string) => {
  const types: Record<string, string> = {
    'reading': 'primary',
    'video': 'success',
    'practice': 'warning',
    'quiz': 'info'
  };
  return types[type] || 'primary';
};

// 获取任务类型文本
const getTaskTypeText = (type: string) => {
  const texts: Record<string, string> = {
    'reading': '阅读',
    'video': '视频',
    'practice': '实践',
    'quiz': '测验'
  };
  return texts[type] || '其他';
};

onMounted(() => {
  init();
});
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.plan-page {
  min-height: 100vh;
  padding-bottom: 150rpx;
  background-color: $bg-color-page;
}

.plan-header {
  background-color: $primary-color;
  padding: 40rpx 30rpx;
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

.plan-basic {
  margin-bottom: 30rpx;
  
  &__info {
    display: flex;
    flex-direction: column;
  }
  
  &__name {
    font-size: $font-size-xlarge;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
  }
  
  &__meta {
    display: flex;
    align-items: center;
  }
  
  &__career {
    font-size: $font-size-small;
    color: rgba(255, 255, 255, 0.9);
    margin-left: 16rpx;
  }
}

.plan-progress-box {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: $border-radius-medium;
  padding: 20rpx;
}

.plan-progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.plan-progress-text {
  font-size: $font-size-small;
  color: rgba(255, 255, 255, 0.9);
}

.plan-progress-value {
  font-size: $font-size-medium;
  font-weight: bold;
  color: #fff;
}

.plan-content {
  padding: 0 30rpx;
}

.plan-card {
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

.plan-description {
  font-size: $font-size-small;
  color: $text-color-regular;
  line-height: 1.6;
}

.plan-tasks {
  margin-bottom: 40rpx;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
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
  
  &__progress {
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
}

.plan-stage {
  margin-bottom: 40rpx;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
    background-color: rgba($primary-color, 0.05);
    border-radius: $border-radius-medium;
    padding: 20rpx;
  }
  
  &__info {
    flex: 1;
  }
  
  &__name {
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-color-primary;
    margin-bottom: 10rpx;
  }
  
  &__desc {
    font-size: $font-size-small;
    color: $text-color-regular;
  }
  
  &__progress {
    margin-left: 20rpx;
  }
  
  &__progress-text {
    font-size: $font-size-small;
    font-weight: bold;
    color: $primary-color;
  }
}

.plan-task-list {
  padding: 0 10rpx;
}

.plan-task-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background-color: #fff;
  border-radius: $border-radius-medium;
  margin-bottom: 20rpx;
  box-shadow: $shadow-light;
  transition: all 0.3s;
  
  &--completed {
    opacity: 0.7;
    
    .plan-task-item__title {
      text-decoration: line-through;
      color: $text-color-secondary;
    }
  }
  
  &__checkbox {
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid $border-color;
    border-radius: 50%;
    margin-right: 20rpx;
    margin-top: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  &__checkbox-inner {
    width: 24rpx;
    height: 24rpx;
    background-color: $primary-color;
    border-radius: 50%;
  }
  
  &__content {
    flex: 1;
  }
  
  &__title {
    font-size: $font-size-medium;
    color: $text-color-primary;
    margin-bottom: 10rpx;
  }
  
  &__desc {
    font-size: $font-size-small;
    color: $text-color-regular;
    margin-bottom: 16rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
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
  
  &__arrow {
    color: $text-color-secondary;
    margin-left: 20rpx;
    font-size: $font-size-medium;
  }
}

.plan-actions {
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