<template>
  <view 
    class="tl-tag" 
    :class="[
      `tl-tag--${type}`,
      `tl-tag--${size}`,
      {
        'is-plain': plain,
        'is-round': round,
        'is-clickable': clickable || closable
      }
    ]"
    @click="handleClick"
  >
    <text class="tl-tag__text">{{ text }}</text>
    <view v-if="closable" class="tl-tag__close" @click.stop="handleClose">×</view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  // 标签文本
  text: {
    type: String,
    default: ''
  },
  // 类型
  type: {
    type: String,
    default: 'default', // default, primary, success, warning, danger, info
    validator: (value: string) => {
      return ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value);
    }
  },
  // 大小
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value: string) => {
      return ['small', 'medium', 'large'].includes(value);
    }
  },
  // 是否为朴素标签
  plain: {
    type: Boolean,
    default: false
  },
  // 是否为圆角标签
  round: {
    type: Boolean,
    default: false
  },
  // 是否可关闭
  closable: {
    type: Boolean,
    default: false
  },
  // 是否可点击
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'close']);

// 处理点击事件
const handleClick = (e: Event) => {
  if (props.clickable) {
    emit('click', e);
  }
};

// 处理关闭事件
const handleClose = (e: Event) => {
  emit('close', e);
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

.tl-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16rpx;
  font-size: $font-size-small;
  line-height: 1.2;
  border-radius: $border-radius-small;
  box-sizing: border-box;
  white-space: nowrap;
  
  &__text {
    line-height: 1.5;
  }
  
  &__close {
    margin-left: 4rpx;
    font-size: $font-size-medium;
    padding: 0 4rpx;
  }
  
  // 大小
  &--small {
    height: 40rpx;
    padding: 0 12rpx;
    font-size: 20rpx;
  }
  
  &--medium {
    height: 52rpx;
    padding: 0 16rpx;
    font-size: $font-size-small;
  }
  
  &--large {
    height: 64rpx;
    padding: 0 20rpx;
    font-size: $font-size-base;
  }
  
  // 圆角
  &.is-round {
    border-radius: 100rpx;
  }
  
  // 可点击
  &.is-clickable {
    cursor: pointer;
    
    &:active {
      opacity: 0.8;
    }
  }
  
  // 默认
  &--default {
    background-color: $bg-color;
    border: 1rpx solid $border-color;
    color: $text-color-regular;
    
    &.is-plain {
      background-color: transparent;
      border-color: $border-color;
      color: $text-color-regular;
    }
  }
  
  // 主要
  &--primary {
    background-color: $primary-color;
    border: 1rpx solid $primary-color;
    color: #fff;
    
    &.is-plain {
      background-color: transparent;
      border-color: $primary-color;
      color: $primary-color;
    }
  }
  
  // 成功
  &--success {
    background-color: $success-color;
    border: 1rpx solid $success-color;
    color: #fff;
    
    &.is-plain {
      background-color: transparent;
      border-color: $success-color;
      color: $success-color;
    }
  }
  
  // 警告
  &--warning {
    background-color: $warning-color;
    border: 1rpx solid $warning-color;
    color: #fff;
    
    &.is-plain {
      background-color: transparent;
      border-color: $warning-color;
      color: $warning-color;
    }
  }
  
  // 危险
  &--danger {
    background-color: $error-color;
    border: 1rpx solid $error-color;
    color: #fff;
    
    &.is-plain {
      background-color: transparent;
      border-color: $error-color;
      color: $error-color;
    }
  }
  
  // 信息
  &--info {
    background-color: $info-color;
    border: 1rpx solid $info-color;
    color: #fff;
    
    &.is-plain {
      background-color: transparent;
      border-color: $info-color;
      color: $info-color;
    }
  }
}
</style> 