<template>
  <view class="test-question">
    <view class="test-question__title">
      <text class="test-question__number">{{ index + 1 }}.</text>
      <text class="test-question__text">{{ question.title }}</text>
    </view>
    
    <view class="test-question__options">
      <view 
        v-for="(option, idx) in question.options" 
        :key="option.id"
        class="test-question__option"
        :class="{ 'test-question__option--selected': selectedOptionId === option.id }"
        @tap="handleOptionSelect(option.id)"
      >
        <view class="test-question__option-marker">{{ optionMarker(idx) }}</view>
        <text class="test-question__option-text">{{ option.content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

// 问题选项接口
interface QuestionOption {
  id: string;
  content: string;
  score: number;
}

// 问题接口
interface Question {
  id: string;
  title: string;
  options: QuestionOption[];
}

const props = defineProps({
  // 问题数据
  question: {
    type: Object as () => Question,
    required: true
  },
  // 问题索引
  index: {
    type: Number,
    default: 0
  },
  // 当前选中的选项ID
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// 选中的选项ID
const selectedOptionId = ref(props.modelValue);

// 选项标记 A, B, C, D...
const optionMarker = (index: number) => {
  return String.fromCharCode(65 + index);
};

// 处理选项选择
const handleOptionSelect = (optionId: string) => {
  selectedOptionId.value = optionId;
  emit('update:modelValue', optionId);
  emit('change', {
    questionId: props.question.id,
    optionId: optionId
  });
};

// 监听modelValue变化
watch(
  () => props.modelValue,
  (newValue) => {
    selectedOptionId.value = newValue;
  }
);
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.test-question {
  margin-bottom: 40rpx;
  
  &__title {
    display: flex;
    margin-bottom: 30rpx;
  }
  
  &__number {
    font-size: $font-size-large;
    font-weight: 500;
    color: $primary-color;
    margin-right: 16rpx;
  }
  
  &__text {
    font-size: $font-size-medium;
    color: $text-color-primary;
    line-height: 1.6;
  }
  
  &__options {
    padding-left: 20rpx;
  }
  
  &__option {
    display: flex;
    align-items: flex-start;
    padding: 24rpx;
    margin-bottom: 20rpx;
    border-radius: $border-radius-medium;
    background-color: #fff;
    border: 2rpx solid $border-color;
    transition: all 0.3s;
    
    &:active {
      opacity: 0.8;
    }
    
    &--selected {
      background-color: rgba($primary-color, 0.1);
      border-color: $primary-color;
      
      .test-question__option-marker {
        background-color: $primary-color;
        color: #fff;
      }
      
      .test-question__option-text {
        color: $primary-color;
      }
    }
  }
  
  &__option-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    background-color: $bg-color;
    color: $text-color-secondary;
    font-size: $font-size-small;
    margin-right: 20rpx;
    transition: all 0.3s;
  }
  
  &__option-text {
    flex: 1;
    font-size: $font-size-medium;
    color: $text-color-regular;
    line-height: 1.5;
  }
}
</style> 