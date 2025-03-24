<template>
  <button
    class="tl-button"
    :class="[
      `tl-button--${type}`,
      `tl-button--${size}`,
      {
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'is-disabled': disabled,
        'is-loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <view v-if="loading" class="tl-button__loading">
      <view class="loading-spinner"></view>
    </view>
    <view v-if="icon && !loading" class="tl-button__icon">
      <text :class="icon"></text>
    </view>
    <view v-if="$slots.default" class="tl-button__text">
      <slot></slot>
    </view>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  // 按钮类型
  type: {
    type: String,
    default: 'default', // default, primary, success, warning, danger, info
    validator: (value: string) => {
      return ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value);
    }
  },
  // 按钮大小
  size: {
    type: String,
    default: 'normal', // small, normal, large
    validator: (value: string) => {
      return ['small', 'normal', 'large'].includes(value);
    }
  },
  // 是否为朴素按钮
  plain: {
    type: Boolean,
    default: false
  },
  // 是否为圆角按钮
  round: {
    type: Boolean,
    default: false
  },
  // 是否为圆形按钮
  circle: {
    type: Boolean,
    default: false
  },
  // 图标类名
  icon: {
    type: String,
    default: ''
  },
  // 是否禁用状态
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否加载中状态
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = (e: Event) => {
  if (props.disabled || props.loading) {
    return;
  }
  emit('click', e);
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

.tl-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;
  transform: translateZ(0);
  transition: all 0.2s;
  user-select: none;
  box-sizing: border-box;
  outline: none;
  
  &__text {
    margin: 0 4px;
  }
  
  &__icon {
    margin-right: 4px;
  }
  
  &__loading {
    margin-right: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: button-loading-rotate 0.8s linear infinite;
    }
  }
  
  // 尺寸
  &--small {
    padding: 6px 15px;
    font-size: $font-size-small;
    border-radius: 4px;
  }
  
  &--normal {
    padding: 8px 20px;
    font-size: $font-size-medium;
    border-radius: 6px;
  }
  
  &--large {
    padding: 12px 25px;
    font-size: $font-size-large;
    border-radius: 8px;
  }
  
  // 圆角
  &.is-round {
    border-radius: 50px;
  }
  
  // 圆形
  &.is-circle {
    padding: 10px;
    border-radius: 50%;
    
    .tl-button__text {
      display: none;
    }
    
    .tl-button__icon {
      margin: 0;
    }
  }
  
  // 默认
  &--default {
    background-color: $bg-color;
    border-color: $border-color;
    color: $text-color-regular;
    
    &:hover:not(.is-disabled) {
      background-color: darken($bg-color, 5%);
      border-color: darken($border-color, 10%);
    }
    
    &.is-plain {
      background-color: transparent;
      
      &:hover:not(.is-disabled) {
        background-color: $bg-color;
      }
    }
  }
  
  // 主要
  &--primary {
    background-color: $primary-color;
    border-color: $primary-color;
    color: #fff;
    
    &:hover:not(.is-disabled) {
      background-color: darken($primary-color, 10%);
      border-color: darken($primary-color, 10%);
    }
    
    &.is-plain {
      background-color: lighten($primary-color, 30%);
      border-color: lighten($primary-color, 10%);
      color: $primary-color;
      
      &:hover:not(.is-disabled) {
        background-color: $primary-color;
        border-color: $primary-color;
        color: #fff;
      }
    }
  }
  
  // 成功
  &--success {
    background-color: $success-color;
    border-color: $success-color;
    color: #fff;
    
    &:hover:not(.is-disabled) {
      background-color: darken($success-color, 10%);
      border-color: darken($success-color, 10%);
    }
    
    &.is-plain {
      background-color: lighten($success-color, 30%);
      border-color: lighten($success-color, 10%);
      color: $success-color;
      
      &:hover:not(.is-disabled) {
        background-color: $success-color;
        border-color: $success-color;
        color: #fff;
      }
    }
  }
  
  // 警告
  &--warning {
    background-color: $warning-color;
    border-color: $warning-color;
    color: #fff;
    
    &:hover:not(.is-disabled) {
      background-color: darken($warning-color, 10%);
      border-color: darken($warning-color, 10%);
    }
    
    &.is-plain {
      background-color: lighten($warning-color, 30%);
      border-color: lighten($warning-color, 10%);
      color: $warning-color;
      
      &:hover:not(.is-disabled) {
        background-color: $warning-color;
        border-color: $warning-color;
        color: #fff;
      }
    }
  }
  
  // 危险
  &--danger {
    background-color: $error-color;
    border-color: $error-color;
    color: #fff;
    
    &:hover:not(.is-disabled) {
      background-color: darken($error-color, 10%);
      border-color: darken($error-color, 10%);
    }
    
    &.is-plain {
      background-color: lighten($error-color, 30%);
      border-color: lighten($error-color, 10%);
      color: $error-color;
      
      &:hover:not(.is-disabled) {
        background-color: $error-color;
        border-color: $error-color;
        color: #fff;
      }
    }
  }
  
  // 信息
  &--info {
    background-color: $info-color;
    border-color: $info-color;
    color: #fff;
    
    &:hover:not(.is-disabled) {
      background-color: darken($info-color, 10%);
      border-color: darken($info-color, 10%);
    }
    
    &.is-plain {
      background-color: lighten($info-color, 30%);
      border-color: lighten($info-color, 10%);
      color: $info-color;
      
      &:hover:not(.is-disabled) {
        background-color: $info-color;
        border-color: $info-color;
        color: #fff;
      }
    }
  }
  
  // 禁用
  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

@keyframes button-loading-rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 