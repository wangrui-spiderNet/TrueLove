import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 状态管理
  const store = Pinia.createPinia()
  app.use(store)
  
  return {
    app,
    Pinia
  }
} 