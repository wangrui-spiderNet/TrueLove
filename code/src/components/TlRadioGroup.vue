<template>
  <view class="tl-radio-group">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, provide } from 'vue';

const props = defineProps({
  // 绑定值
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// 向下提供数据
provide('radioGroup', {
  modelValue: props.modelValue,
  disabled: props.disabled,
  changeEvent: (value: any) => {
    emit('update:modelValue', value);
    emit('change', value);
  }
});
</script>

<style lang="scss">
.tl-radio-group {
  display: flex;
  flex-wrap: wrap;
}
</style> 