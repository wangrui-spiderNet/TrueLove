<template>
  <view 
    class="tl-radio" 
    :class="[
      {
        'is-checked': isChecked,
        'is-disabled': disabled
      }
    ]"
    @tap="handleClick"
  >
    <view class="tl-radio__input">
      <view class="tl-radio__inner"></view>
    </view>
    <view class="tl-radio__label">
      <slot>{{ label }}</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  // 绑定值
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  // 单选框的值
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 单选框的文本
  label: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// 是否选中
const isChecked = computed(() => {
  return props.modelValue === props.value;
});

// 处理点击事件
const handleClick = () => {
  if (props.disabled) return;
  
  if (!isChecked.value) {
    emit('update:modelValue', props.value);
    emit('change', props.value);
  }
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

.tl-radio {
  display: inline-flex;
  align-items: center;
  margin-right: 30rpx;
  vertical-align: middle;
  cursor: pointer;
  
  &__input {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid $border-color;
    border-radius: 50%;
    background-color: #fff;
    transition: all 0.3s;
  }
  
  &__inner {
    width: 0;
    height: 0;
    border-radius: 50%;
    background-color: $primary-color;
    transition: all 0.3s;
  }
  
  &__label {
    margin-left: 16rpx;
    font-size: $font-size-medium;
    color: $text-color-regular;
  }
  
  &.is-checked {
    .tl-radio__input {
      border-color: $primary-color;
    }
    
    .tl-radio__inner {
      width: 24rpx;
      height: 24rpx;
    }
    
    .tl-radio__label {
      color: $primary-color;
    }
  }
  
  &.is-disabled {
    cursor: not-allowed;
    
    .tl-radio__input {
      border-color: $border-color;
      background-color: $bg-color;
    }
    
    .tl-radio__label {
      color: $text-color-disabled;
    }
    
    &.is-checked {
      .tl-radio__inner {
        background-color: $border-color;
      }
      
      .tl-radio__label {
        color: $text-color-disabled;
      }
    }
  }
}
</style> 