import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 检查系统暗黑模式
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
}

createApp(App).mount('#app')
