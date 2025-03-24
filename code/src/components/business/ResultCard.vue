<template>
  <tl-card class="result-card" shadow="always">
    <template #header>
      <view class="result-card__header">
        <text class="result-card__title">{{ title }}</text>
        <view v-if="showDate" class="result-card__date">{{ formatDate(date) }}</view>
      </view>
    </template>
    
    <view class="result-card__content">
      <view v-if="items.length > 0" class="result-card__list">
        <view 
          v-for="(item, index) in items" 
          :key="index"
          class="result-card__item"
        >
          <view class="result-card__item-name">{{ item.name }}</view>
          <view class="result-card__item-bar">
            <tl-progress 
              :percentage="calculatePercentage(item.score)" 
              :type="getTypeByScore(item.score)"
              :format="() => `${item.score}分`"
              :text-inside="true"
            />
          </view>
          <view v-if="showDetail" class="result-card__item-detail">
            {{ item.description }}
          </view>
        </view>
      </view>
      
      <view v-if="showAnalysis && analysis" class="result-card__analysis">
        <view class="result-card__analysis-title">结果分析</view>
        <view class="result-card__analysis-content">{{ analysis }}</view>
      </view>
      
      <slot></slot>
    </view>
    
    <template #footer>
      <view class="result-card__footer">
        <slot name="footer">
          <tl-button 
            v-if="showDetailBtn"
            type="primary" 
            size="small" 
            @click="handleShowDetail"
          >
            {{ showDetail ? '收起详情' : '查看详情' }}
          </tl-button>
        </slot>
      </view>
    </template>
  </tl-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import TlCard from '../TlCard.vue';
import TlProgress from '../TlProgress.vue';
import TlButton from '../TlButton.vue';

// 结果项类型
interface ResultItem {
  name: string;
  score: number;
  description?: string;
}

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '测试结果'
  },
  // 结果项列表
  items: {
    type: Array as () => ResultItem[],
    default: () => []
  },
  // 结果分析
  analysis: {
    type: String,
    default: ''
  },
  // 是否显示分析
  showAnalysis: {
    type: Boolean,
    default: true
  },
  // 是否显示日期
  showDate: {
    type: Boolean,
    default: true
  },
  // 测试日期
  date: {
    type: [Date, String, Number],
    default: () => new Date()
  },
  // 是否显示详情按钮
  showDetailBtn: {
    type: Boolean,
    default: true
  }
});

// 是否显示详情
const showDetail = ref(false);

// 处理显示详情按钮点击
const handleShowDetail = () => {
  showDetail.value = !showDetail.value;
};

// 计算百分比
const calculatePercentage = (score: number) => {
  // 假设满分为100
  return score > 100 ? 100 : score;
};

// 根据分数获取进度条类型
const getTypeByScore = (score: number) => {
  if (score >= 85) return 'success';
  if (score >= 70) return 'primary';
  if (score >= 60) return 'warning';
  return 'danger';
};

// 格式化日期
const formatDate = (date: Date | string | number) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.result-card {
  margin-bottom: 30rpx;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  &__title {
    font-size: $font-size-large;
    font-weight: 500;
    color: $text-color-primary;
  }
  
  &__date {
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
  
  &__content {
    padding: 10rpx 0;
  }
  
  &__list {
    margin-bottom: 30rpx;
  }
  
  &__item {
    margin-bottom: 30rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &__item-name {
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-color-primary;
    margin-bottom: 16rpx;
  }
  
  &__item-bar {
    margin-bottom: 16rpx;
  }
  
  &__item-detail {
    font-size: $font-size-small;
    color: $text-color-regular;
    line-height: 1.6;
    background-color: $bg-color-page;
    padding: 20rpx;
    border-radius: $border-radius-small;
  }
  
  &__analysis {
    padding: 20rpx;
    background-color: rgba($primary-color, 0.05);
    border-radius: $border-radius-small;
  }
  
  &__analysis-title {
    font-size: $font-size-medium;
    font-weight: 500;
    color: $primary-color;
    margin-bottom: 16rpx;
  }
  
  &__analysis-content {
    font-size: $font-size-small;
    color: $text-color-regular;
    line-height: 1.6;
  }
  
  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style> 