import { ref } from 'vue'

const isCompactMode = ref(true) // 默认紧凑模式
const currentMode = ref<'compact' | 'fullscreen'>('compact') // 添加当前模式状态

export function useDisplayMode() {
  // 从 localStorage 加载显示模式
  const initDisplayMode = () => {
    const savedMode = localStorage.getItem('display-mode') as 'compact' | 'fullscreen' | null
    isCompactMode.value = savedMode !== 'fullscreen'
    currentMode.value = savedMode || 'compact'
  }

  // 切换显示模式
  const toggleDisplayMode = (mode: 'compact' | 'fullscreen') => {
    isCompactMode.value = mode === 'compact'
    currentMode.value = mode
    localStorage.setItem('display-mode', mode)
  }

  // 初始化
  initDisplayMode()

  return {
    isCompactMode,
    currentMode,
    toggleDisplayMode
  }
} 