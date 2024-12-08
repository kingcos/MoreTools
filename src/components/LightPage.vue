<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <!-- 标题栏 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('light.title') }}</h1>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <!-- 色块展示区域 -->
      <div class="h-full flex flex-wrap">
        <div
          v-for="(block, index) in colorBlocks"
          :key="index"
          class="relative transition-all duration-300"
          :class="getBlockClass()"
        >
          <!-- 色块 -->
          <div 
            class="w-full h-full transition-colors duration-300 relative group"
            :style="{ backgroundColor: block.color }"
          >
            <!-- 色块内的按钮 -->
            <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <!-- 删除按钮 -->
              <div
                v-if="colorBlocks.length > 1"
                @click="removeBlock(index)"
                class="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 
                       flex items-center justify-center cursor-pointer
                       transition-colors shadow-lg backdrop-blur-sm
                       transform hover:scale-105"
              >
                <svg 
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  />
                </svg>
              </div>

              <!-- 收藏按钮 -->
              <div
                @click="toggleFavorite(block.color)"
                class="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 
                       flex items-center justify-center cursor-pointer
                       transition-colors shadow-lg backdrop-blur-sm
                       transform hover:scale-105"
              >
                <svg
                  class="w-4 h-4"
                  :class="favoriteColors.includes(block.color) ? 'text-yellow-500 fill-current' : 'text-white'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>

            <!-- 颜色选择器面板 -->
            <div 
              class="absolute bottom-4 left-1/2 -translate-x-1/2 
                     bg-white/90 dark:bg-gray-800/90 rounded-lg p-2 shadow-lg"
            >
              <div class="flex items-center gap-4">
                <!-- 左侧：当前颜色（带颜色选择器） -->
                <input
                  type="color"
                  :value="block.color"
                  @input="e => setBlockColor(index, e.target.value)"
                  class="w-8 h-8 rounded-md cursor-pointer border-2 border-blue-500 shadow-md"
                >

                <!-- 右侧：收藏颜色 -->
                <div v-if="favoriteColors.length > 0" class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400 w-8">收藏</span>
                  <div class="flex items-center gap-1">
                    <button
                      v-for="color in favoriteColors"
                      :key="color"
                      class="w-6 h-6 rounded-md transition-transform hover:scale-110 focus:outline-none p-0"
                      :style="{ backgroundColor: color }"
                      @click="setBlockColor(index, color)"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <!-- 左侧：添加按钮 -->
      <button
        @click="addBlock"
        :disabled="colorBlocks.length >= 4"
        class="p-2 rounded-lg transition-all focus:outline-none"
        :class="[
          colorBlocks.length >= 4 
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white cursor-pointer'
        ]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </button>

      <!-- 右侧：全屏按钮 -->
      <button
        @click="toggleFullscreen"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
               text-gray-800 dark:text-white border border-transparent transition-all focus:outline-none"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
          />
        </svg>
      </button>
    </div>

    <!-- 全屏模式 -->
    <div 
      v-if="isFullscreen"
      class="fixed inset-0 z-50 flex flex-wrap"
      @click="exitFullscreen"
    >
      <div
        v-for="(block, index) in colorBlocks"
        :key="index"
        class="transition-colors duration-300"
        :class="getBlockClass()"
        :style="{ backgroundColor: block.color }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplayMode } from '../composables/useDisplayMode'

const { t } = useI18n()
const { isCompactMode } = useDisplayMode()

// 从本地存储加载收藏颜色
const loadFavoriteColors = () => {
  const saved = localStorage.getItem('favoriteColors')
  return saved ? JSON.parse(saved) : [
    '#FFE4E1', // 默认颜色
    '#F0F8FF',
    '#FFD700',
    '#FFA500',
    '#FF69B4',
  ]
}

// 状态管理
const isFullscreen = ref(false)
const colorBlocks = ref([{ color: loadFavoriteColors()[0] }])
const favoriteColors = ref(loadFavoriteColors())

// 取色块类名
const getBlockClass = () => {
  const count = colorBlocks.value.length
  
  switch (count) {
    case 1: return 'w-full h-full'
    case 2: return 'w-1/2 h-full'
    case 3:
    case 4: return 'w-1/2 h-1/2'
    default: return ''
  }
}

// 添加色块
const addBlock = () => {
  if (colorBlocks.value.length < 4) {
    colorBlocks.value.push({ color: '#FFFFFF' })
  }
}

// 移除色块
const removeBlock = (index: number) => {
  if (colorBlocks.value.length > 1) {
    colorBlocks.value.splice(index, 1)
  }
}

// 设置色块颜色
const setBlockColor = (blockIndex: number, color: string) => {
  colorBlocks.value[blockIndex].color = color
}

// 切换收藏状态
const toggleFavorite = (color: string) => {
  const index = favoriteColors.value.indexOf(color)
  if (index === -1) {
    // 添加收藏
    favoriteColors.value.unshift(color)
    if (favoriteColors.value.length > 5) {
      favoriteColors.value.pop()
    }
  } else {
    // 取消收藏
    favoriteColors.value.splice(index, 1)
  }
  saveFavoriteColors()
}

// 保存收藏颜色到本地存储
const saveFavoriteColors = () => {
  localStorage.setItem('favoriteColors', JSON.stringify(favoriteColors.value))
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = true
}

// 退出全屏
const exitFullscreen = () => {
  isFullscreen.value = false
}
</script>

<style scoped>
input[type="color"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0;
  border: none;
  border-radius: 0.375rem;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 0.375rem;
}

.dark input[type="color"] {
  border-color: #4b5563;
}

/* 确保 SVG 图标在暗色背景上清晰可见 */
.text-white svg,
.text-white\/90 svg,
.text-yellow-300 svg {
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
}

/* 按钮悬停时的缩放效果 */
button {
  transform: scale(1);
}
button:hover {
  transform: scale(1.05);
}
</style> 