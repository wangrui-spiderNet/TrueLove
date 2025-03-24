<template>
  <view class="tl-slider" :class="[
    `tl-slider--${type}`,
    {
      'is-disabled': disabled
    }
  ]">
    <view class="tl-slider__runway" ref="sliderRunway" @tap="onSliderClick">
      <view 
        class="tl-slider__bar" 
        :style="{
          width: `${barWidth}%`
        }"
      ></view>
      <view 
        class="tl-slider__button-wrapper"
        :style="{
          left: `${barWidth}%`
        }"
        @touchstart="onButtonTouchStart"
        @touchmove="onButtonTouchMove"
        @touchend="onButtonTouchEnd"
      >
        <view class="tl-slider__button"></view>
      </view>
    </view>
    <view v-if="showValue" class="tl-slider__value">
      {{ formatValue }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from 'vue';

const props = defineProps({
  // 当前值
  modelValue: {
    type: Number,
    default: 0
  },
  // 最小值
  min: {
    type: Number,
    default: 0
  },
  // 最大值
  max: {
    type: Number,
    default: 100
  },
  // 步长
  step: {
    type: Number,
    default: 1
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否显示当前值
  showValue: {
    type: Boolean,
    default: false
  },
  // 类型
  type: {
    type: String,
    default: 'primary', // primary, success, warning, danger, info
    validator: (value: string) => {
      return ['primary', 'success', 'warning', 'danger', 'info'].includes(value);
    }
  },
  // 格式化显示值
  format: {
    type: Function,
    default: (value: number) => value
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// DOM引用
const sliderRunway = ref<any>(null);

// 滑块状态
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const startValue = ref(0);

// 计算进度条宽度百分比
const barWidth = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100;
});

// 格式化后的值
const formatValue = computed(() => {
  return props.format(props.modelValue);
});

// 将位置转换为值
const positionToValue = (position: number, width: number): number => {
  // 计算百分比
  const percent = position / width;
  
  // 根据百分比计算值
  let newValue = percent * (props.max - props.min) + props.min;
  
  // 步长处理
  if (props.step > 0) {
    newValue = Math.round(newValue / props.step) * props.step;
  }
  
  // 限制在最小值和最大值之间
  return Math.max(props.min, Math.min(props.max, newValue));
};

// 更新值
const updateValue = (value: number) => {
  if (value === props.modelValue) return;
  
  emit('update:modelValue', value);
};

// 处理滑块点击
const onSliderClick = (e: any) => {
  if (props.disabled) return;
  
  // 获取滑块区域信息
  const rect = e.currentTarget.getBoundingClientRect();
  
  // 计算点击位置相对于滑块起点的距离
  const position = e.touches[0].clientX - rect.left;
  
  // 计算新值
  const newValue = positionToValue(position, rect.width);
  
  // 更新值
  updateValue(newValue);
  emit('change', newValue);
};

// 处理滑块按钮触摸开始
const onButtonTouchStart = (e: any) => {
  if (props.disabled) return;
  
  // 标记开始拖动
  isDragging.value = true;
  
  // 记录开始位置
  startX.value = e.touches[0].clientX;
  currentX.value = startX.value;
  
  // 记录开始值
  startValue.value = props.modelValue;
  
  // 阻止默认行为，避免页面滚动
  e.preventDefault();
  e.stopPropagation();
};

// 处理滑块按钮触摸移动
const onButtonTouchMove = (e: any) => {
  if (!isDragging.value) return;
  
  // 记录当前位置
  currentX.value = e.touches[0].clientX;
  
  // 获取滑块区域信息
  const rect = sliderRunway.value.getBoundingClientRect();
  
  // 计算位置相对于滑块起点的距离
  const diff = currentX.value - startX.value;
  const percent = diff / rect.width;
  const valueDiff = percent * (props.max - props.min);
  const newValue = Math.max(props.min, Math.min(props.max, startValue.value + valueDiff));
  
  // 步长处理
  const steppedValue = Math.round(newValue / props.step) * props.step;
  
  // 更新值
  updateValue(steppedValue);
  
  // 阻止默认行为，避免页面滚动
  e.preventDefault();
  e.stopPropagation();
};

// 处理滑块按钮触摸结束
const onButtonTouchEnd = (e: any) => {
  if (!isDragging.value) return;
  
  // 标记结束拖动
  isDragging.value = false;
  
  // 触发change事件
  emit('change', props.modelValue);
  
  // 阻止默认行为，避免页面滚动
  e.preventDefault();
  e.stopPropagation();
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

.tl-slider {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100rpx;
  box-sizing: border-box;
  
  &__runway {
    position: relative;
    flex: 1;
    height: 8rpx;
    background-color: $bg-color;
    border-radius: 4rpx;
    cursor: pointer;
  }
  
  &__bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: $primary-color;
    border-radius: 4rpx;
    transition: width 0.2s;
  }
  
  &__button-wrapper {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 50rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__button {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
    
    &:active {
      transform: scale(1.2);
    }
  }
  
  &__value {
    margin-left: 20rpx;
    font-size: $font-size-medium;
    color: $text-color-regular;
    min-width: 48rpx;
    text-align: center;
  }
  
  // 类型
  &--primary .tl-slider__bar {
    background-color: $primary-color;
  }
  
  &--success .tl-slider__bar {
    background-color: $success-color;
  }
  
  &--warning .tl-slider__bar {
    background-color: $warning-color;
  }
  
  &--danger .tl-slider__bar {
    background-color: $error-color;
  }
  
  &--info .tl-slider__bar {
    background-color: $info-color;
  }
  
  // 禁用
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    .tl-slider__bar, .tl-slider__button {
      cursor: not-allowed;
    }
    
    .tl-slider__button:active {
      transform: scale(1);
    }
  }
}
</style> 