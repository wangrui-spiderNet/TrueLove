<template>
  <view 
    class="tl-card" 
    :class="[
      `tl-card--${shadow}`,
      {
        'is-bordered': bordered
      }
    ]"
  >
    <view v-if="$slots.header || title" class="tl-card__header">
      <slot name="header">
        <text class="tl-card__title">{{ title }}</text>
      </slot>
    </view>
    <view 
      class="tl-card__body"
      :style="bodyStyle"
    >
      <slot></slot>
    </view>
    <view v-if="$slots.footer" class="tl-card__footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  // 卡片标题
  title: {
    type: String,
    default: ''
  },
  // 卡片阴影效果
  shadow: {
    type: String,
    default: 'always', // always, hover, never
    validator: (value: string) => {
      return ['always', 'hover', 'never'].includes(value);
    }
  },
  // 是否显示边框
  bordered: {
    type: Boolean,
    default: true
  },
  // 卡片内容区域样式
  bodyStyle: {
    type: [String, Object],
    default: ''
  }
});
</script>

<style lang="scss">
@import '../styles/variables.scss';

.tl-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  border-radius: $border-radius-medium;
  transition: box-shadow 0.3s;
  margin-bottom: 20px;
  box-sizing: border-box;
  
  &.is-bordered {
    border: 1px solid $border-color;
  }
  
  &--always {
    box-shadow: $shadow-base;
  }
  
  &--hover {
    &:hover {
      box-shadow: $shadow-base;
    }
  }
  
  &--never {
    box-shadow: none;
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid $border-color-light;
  }
  
  &__title {
    font-size: $font-size-large;
    font-weight: 500;
    color: $text-color-primary;
  }
  
  &__body {
    padding: 20px;
    flex: 1;
  }
  
  &__footer {
    padding: 16px 20px;
    border-top: 1px solid $border-color-light;
  }
}
</style> 