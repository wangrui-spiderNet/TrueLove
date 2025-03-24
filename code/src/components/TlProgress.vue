<template>
  <view class="tl-progress" :class="{
    [`tl-progress--${type}`]: type,
    'tl-progress--inside-text': textInside,
    'tl-progress--without-text': !showText
  }">
    <view class="tl-progress__bar">
      <view class="tl-progress__outer">
        <view 
          class="tl-progress__inner" 
          :style="{
            width: `${percentage}%`,
            animationDuration: `${duration}s`
          }"
        >
          <text v-if="textInside && showText" class="tl-progress__text">
            {{ text }}
          </text>
        </view>
      </view>
    </view>
    <view v-if="!textInside && showText" class="tl-progress__text">
      {{ text }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps({
  // 百分比
  percentage: {
    type: Number,
    default: 0,
    validator: (val: number) => val >= 0 && val <= 100
  },
  // 类型
  type: {
    type: String,
    default: 'primary', // primary, success, warning, danger, info
    validator: (value: string) => {
      return ['primary', 'success', 'warning', 'danger', 'info'].includes(value);
    }
  },
  // 是否显示文字
  showText: {
    type: Boolean,
    default: true
  },
  // 文字是否显示在进度条内
  textInside: {
    type: Boolean,
    default: false
  },
  // 自定义文字
  format: {
    type: Function,
    default: (percentage: number) => `${percentage}%`
  },
  // 动画持续时间（秒）
  duration: {
    type: Number,
    default: 0.6
  }
});

// 计算进度文字
const text = computed(() => {
  return props.format(props.percentage);
});
</script>

<style lang="scss">
@import '../styles/variables.scss';

.tl-progress {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  
  &__bar {
    flex: 1;
  }
  
  &__outer {
    position: relative;
    height: 30rpx;
    background-color: $bg-color;
    border-radius: 100rpx;
    overflow: hidden;
    vertical-align: middle;
  }
  
  &__inner {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    text-align: right;
    border-radius: 100rpx;
    line-height: 30rpx;
    white-space: nowrap;
    transition: width 0.6s ease;
    background-color: $primary-color;
    
    &::after {
      display: inline-block;
      content: "";
      height: 100%;
      vertical-align: middle;
    }
  }
  
  &__text {
    display: inline-block;
    margin-left: 16rpx;
    font-size: $font-size-small;
    color: $text-color-regular;
    vertical-align: middle;
  }
  
  &--inside-text {
    .tl-progress__inner {
      padding-right: 16rpx;
    }
    
    .tl-progress__text {
      margin-left: 0;
      color: #fff;
    }
  }
  
  &--without-text {
    .tl-progress__outer {
      height: 16rpx;
    }
  }
  
  // 类型
  &--primary .tl-progress__inner {
    background-color: $primary-color;
  }
  
  &--success .tl-progress__inner {
    background-color: $success-color;
  }
  
  &--warning .tl-progress__inner {
    background-color: $warning-color;
  }
  
  &--danger .tl-progress__inner {
    background-color: $error-color;
  }
  
  &--info .tl-progress__inner {
    background-color: $info-color;
  }
}
</style> 