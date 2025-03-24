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
    Pinia,
    // 配置路由
    router: {
      // 路由配置
      routes: [
        {
          path: '/',
          redirect: '/pages/home/index'
        }
      ]
    }
  }
} 