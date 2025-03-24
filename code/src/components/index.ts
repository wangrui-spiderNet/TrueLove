import { App } from 'vue';

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

// 安装函数
export function install(app: App) {
  components.forEach(component => {
    app.component(component.name, component);
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