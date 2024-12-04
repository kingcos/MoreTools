<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ChatPage from './components/ChatPage.vue'
import FanfouPage from './components/FanfouPage.vue'
import StoryPage from './components/StoryPage.vue'

const isSidebarOpen = ref(true)
const isDarkMode = ref(document.documentElement.classList.contains('dark'))
const currentPage = ref('chat')

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('darkMode', isDarkMode.value ? 'dark' : 'light')
}

const handleResize = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  handleResize() // 初始化时检查窗口宽度
  window.addEventListener('resize', handleResize)

  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMediaQuery.addEventListener('change', e => {
    isDarkMode.value = e.matches
    document.documentElement.classList.toggle('dark', e.matches)
  })

  const savedMode = localStorage.getItem('darkMode')
  if (savedMode === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const pages = {
  chat: ChatPage,
  fanfou: FanfouPage,
  story: StoryPage
}
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- 侧边栏 -->
    <div
      :class="[
        'transition-all duration-300 ease-in-out',
        'w-64',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed h-full'
      ]"
      class="bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10"
    >
      <div class="h-full flex flex-col">
        <!-- 侧边栏头部 - 按钮区域 -->
        <div class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-transparent transition-all focus:outline-none"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          <!-- 暗黑模式切换按钮 -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-transparent transition-all focus:outline-none"
          >
            <svg
              v-if="!isDarkMode"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
          </button>
        </div>

        <!-- 侧边栏内容 -->
        <div class="flex-1 overflow-y-auto">
          <nav class="px-4 py-4 space-y-2">
            <div
              @click="currentPage = 'chat'"
              :class="[
                'flex items-center p-2 rounded-lg cursor-pointer transition-all',
                currentPage === 'chat'
                  ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-white font-medium'
                  : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="ml-2">ChatGPT</span>
            </div>
            <div
              @click="currentPage = 'fanfou'"
              :class="[
                'flex items-center p-2 rounded-lg cursor-pointer transition-all',
                currentPage === 'fanfou'
                  ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-white font-medium'
                  : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="ml-2">我的饭否</span>
            </div>
            <div
              @click="currentPage = 'story'"
              :class="[
                'flex items-center p-2 rounded-lg cursor-pointer transition-all',
                currentPage === 'story'
                  ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-white font-medium'
                  : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="ml-2">故事维维</span>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div 
      :class="[
        'flex-1',
        isSidebarOpen ? 'md:ml-64' : 'ml-0'
      ]"
      class="transition-all duration-300 h-full relative"
    >
      <!-- 当边栏收起时的顶部按钮 -->
      <button
        v-if="!isSidebarOpen"
        @click="toggleSidebar"
        class="fixed left-4 top-4 p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white border border-transparent z-50 transition-all focus:outline-none"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- 动态组件用于切换页面 -->
      <component 
        :is="pages[currentPage]"
        class="h-full"
      />
    </div>

    <!-- 遮罩层 - 仅在移动端且边栏打开时显示 -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
    ></div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

:root {
  color-scheme: light dark;
}
</style>
