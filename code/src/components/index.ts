// 导入组件
import TlButton from './TlButton.vue';
import TlCard from './TlCard.vue';
import TlInput from './TlInput.vue';
import TlTag from './TlTag.vue';
import TlProgress from './TlProgress.vue';
import TlSlider from './TlSlider.vue';
import TlRadio from './TlRadio.vue';
import TlRadioGroup from './TlRadioGroup.vue';

// 组件列表
const components = [
  TlButton,
  TlCard,
  TlInput,
  TlTag,
  TlProgress,
  TlSlider,
  TlRadio,
  TlRadioGroup
];

// 组件名称映射 - 使用字符串数组代替对象映射，避免类型问题
const componentNames = [
  'TlButton',
  'TlCard',
  'TlInput',
  'TlTag',
  'TlProgress',
  'TlSlider',
  'TlRadio',
  'TlRadioGroup'
];

// 安装函数 - 使用any类型代替App类型，避免导入Vue相关类型导致的报错
export function install(app: any) {
  components.forEach((component, index) => {
    app.component(componentNames[index], component);
  });
}

// 默认导出
export default {
  install
};

// 单独导出组件
export {
  TlButton,
  TlCard,
  TlInput,
  TlTag,
  TlProgress,
  TlSlider,
  TlRadio,
  TlRadioGroup
}; 