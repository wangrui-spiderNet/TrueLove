<template>
  <view class="tl-input" :class="[
    {
      'is-disabled': disabled,
      'is-error': error
    }
  ]">
    <view v-if="label" class="tl-input__label">
      <text>{{ label }}</text>
      <text v-if="required" class="tl-input__required">*</text>
    </view>
    <view class="tl-input__wrapper">
      <view v-if="prefixIcon" class="tl-input__prefix">
        <text :class="prefixIcon"></text>
      </view>
      <input
        class="tl-input__inner"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :focus="focus"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleConfirm"
      />
      <view v-if="suffixIcon || clearable" class="tl-input__suffix">
        <text 
          v-if="clearable && modelValue && !disabled" 
          class="tl-input__clear"
          @click="handleClear"
        >×</text>
        <text v-else-if="suffixIcon" :class="suffixIcon"></text>
      </view>
    </view>
    <view v-if="error && errorMsg" class="tl-input__error">
      {{ errorMsg }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  // 绑定值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 输入框类型
  type: {
    type: String,
    default: 'text'
  },
  // 占位文本
  placeholder: {
    type: String,
    default: '请输入'
  },
  // 标签文本
  label: {
    type: String,
    default: ''
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  // 前缀图标
  prefixIcon: {
    type: String,
    default: ''
  },
  // 后缀图标
  suffixIcon: {
    type: String,
    default: ''
  },
  // 是否可清空
  clearable: {
    type: Boolean,
    default: false
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否出错
  error: {
    type: Boolean,
    default: false
  },
  // 错误信息
  errorMsg: {
    type: String,
    default: ''
  },
  // 最大长度
  maxlength: {
    type: Number,
    default: -1
  },
  // 自动获取焦点
  focus: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'clear', 'confirm']);

// 处理输入事件
const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value);
};

// 处理聚焦事件
const handleFocus = (e: any) => {
  emit('focus', e);
};

// 处理失焦事件
const handleBlur = (e: any) => {
  emit('blur', e);
};

// 处理清空事件
const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};

// 处理确认事件
const handleConfirm = (e: any) => {
  emit('confirm', e);
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

.tl-input {
  position: relative;
  margin-bottom: 20rpx;
  
  &__label {
    display: flex;
    font-size: $font-size-medium;
    color: $text-color-primary;
    margin-bottom: 12rpx;
  }
  
  &__required {
    color: $error-color;
    margin-left: 4rpx;
  }
  
  &__wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    border: 2rpx solid $border-color;
    border-radius: $border-radius-small;
    background-color: #fff;
    box-sizing: border-box;
    transition: all 0.3s;
  }
  
  &__inner {
    flex: 1;
    width: 100%;
    height: 80rpx;
    padding: 0 24rpx;
    font-size: $font-size-medium;
    color: $text-color-primary;
    background-color: transparent;
    border: none;
    outline: none;
    box-sizing: border-box;
  }
  
  &__prefix, &__suffix {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80rpx;
    color: $text-color-secondary;
  }
  
  &__clear {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-large;
    color: $text-color-secondary;
  }
  
  &__error {
    margin-top: 8rpx;
    font-size: $font-size-small;
    color: $error-color;
  }
  
  &.is-disabled {
    .tl-input__wrapper {
      background-color: $bg-color;
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .tl-input__inner {
      color: $text-color-secondary;
      cursor: not-allowed;
    }
  }
  
  &.is-error {
    .tl-input__wrapper {
      border-color: $error-color;
    }
  }
  
  &:not(.is-disabled):not(.is-error) {
    .tl-input__wrapper:hover {
      border-color: darken($border-color, 10%);
    }
    
    .tl-input__inner:focus + .tl-input__wrapper {
      border-color: $primary-color;
    }
  }
}
</style> 