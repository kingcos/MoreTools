<script setup lang="ts">
import { ref, onMounted, computed, nextTick, defineComponent } from 'vue'
import ChatPage from './components/ChatPage.vue'
import FanfouPage from './components/FanfouPage.vue'
import StoryPage from './components/StoryPage.vue'
import QrcodePage from './components/QrcodePage.vue'
import CodecPage from './components/CodecPage.vue'
import menuConfig from './config/menu.json'
import { useI18n } from 'vue-i18n'
import { LOCALES } from './config/i18n'
import QrcodeIcon from './components/icons/QrcodeIcon.vue'
import Adsense from './components/Adsense.vue'
import CodeIcon from './components/icons/CodeIcon.vue'

const { locale, t } = useI18n()

// 组件映射
const componentMap = {
  ChatPage,
  FanfouPage,
  StoryPage,
  QrcodePage,
  CodecPage
} as const

// 状态管理
const isSidebarOpen = ref(window.innerWidth >= 768)
const isDarkMode = ref(document.documentElement.classList.contains('dark'))
const currentPage = ref('')
const searchQuery = ref('')
const confirmingUnstar = ref<string | null>(null)
const isLocaleMenuOpen = ref(false)

// 收藏状态持久化
const loadStarredState = () => {
  const saved = localStorage.getItem('starredItems')
  return saved ? JSON.parse(saved) : {}
}

// 初始化菜单数据
const menuItems = ref(menuConfig.menuItems.map(item => ({
  ...item,
  children: item.children.map(child => ({
    ...child,
    component: componentMap[child.component as keyof typeof componentMap],
    isStarred: loadStarredState()[child.id] || false
  }))
})))

// 计算收藏项目
const starredItems = computed(() => {
  const items: any[] = []
  menuItems.value.forEach(menu => {
    menu.children.forEach(child => {
      if (child.isStarred) {
        items.push({ ...child, menuId: menu.id })
      }
    })
  })
  return items
})

// 过滤菜单项
const filteredMenuItems = computed(() => {
  if (!searchQuery.value) return menuItems.value

  return menuItems.value.map(menu => ({
    ...menu,
    children: menu.children.filter(child =>
      t(child.titleKey).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })).filter(menu => menu.children.length > 0)
})

// 获取当前组件
const getCurrentComponent = computed(() => {
  const findComponent = (id: string) => {
    // 先在收藏项中查找
    const starredItem = starredItems.value.find(item => item.id === id)
    if (starredItem) return starredItem.component

    // 再在菜单项中查找
    for (const menu of menuItems.value) {
      const child = menu.children.find(item => item.id === id)
      if (child) return child.component
    }
    return null
  }

  return findComponent(currentPage.value) || menuItems.value[0]?.children[0]?.component || null
})

// 事件处理
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value ? 'dark' : 'light')
}

const toggleMenu = (menuId: string) => {
  const menu = menuItems.value.find(item => item.id === menuId)
  if (menu) {
    menu.isOpen = !menu.isOpen
  }
}

const toggleStar = (menuId: string, childId: string) => {
  const menu = menuItems.value.find(item => item.id === menuId)
  if (menu) {
    const child = menu.children.find(item => item.id === childId)
    if (child) {
      child.isStarred = !child.isStarred
      const starredState = loadStarredState()
      starredState[childId] = child.isStarred
      localStorage.setItem('starredItems', JSON.stringify(starredState))
    }
  }
}

const selectPage = (pageId: string) => {
  currentPage.value = pageId
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
  }
}

// 初始化
onMounted(() => {
  nextTick(() => {
    if (starredItems.value.length > 0) {
      currentPage.value = starredItems.value[0].id
    } else {
      const firstMenu = menuItems.value[0]
      if (firstMenu?.children.length > 0) {
        currentPage.value = firstMenu.children[0].id
      }
    }
  })
})

// 添加语言切换函数
const changeLocale = (code: string) => {
  locale.value = code
  localStorage.setItem('locale', code)
}

// 注册图标组件
const icons: Record<string, ReturnType<typeof defineComponent>> = {
  QrcodeIcon,
  CodeIcon
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
        <!-- 侧边栏头部 -->
        <div class="p-2 space-y-2">
          <!-- 关闭和暗黑模式按钮组 -->
          <div class="flex justify-between items-center">
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                     text-gray-800 dark:text-white border border-transparent transition-all focus:outline-none"
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
            
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                     text-gray-800 dark:text-white border border-transparent transition-all focus:outline-none"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="isDarkMode"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>
          </div>

          <!-- 网站信息区域 -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <!-- Logo -->
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white text-xl font-bold">Mo</span>
              </div>
              
              <!-- 标题和链接 -->
              <div class="flex-1">
                <h1 class="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  MoreTools
                  <span class="text-sm text-gray-600 dark:text-gray-300">
                    摸摸工具箱
                  </span>
                </h1>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <a 
                    href="https://kingcos.me/moretools" 
                    target="_blank"
                    class="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    kingcos.me/moretools
                  </a>
                </div>
              </div>
            </div>

            <!-- 分割线 -->
            <div class="border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <!-- 搜索框 -->
          <div class="relative mt-6">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('common.search')"
              class="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                     text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                     transition-colors"
            />
            <svg
              class="absolute right-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- 收藏列表 -->
          <div v-if="starredItems.length > 0" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {{ t('common.starred') }}
            </div>
            <div class="space-y-1">
              <div
                v-for="item in starredItems"
                :key="item.id"
                @click="selectPage(item.id)"
                class="p-2 rounded-lg cursor-pointer transition-all"
                :class="[
                  currentPage === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-white font-medium'
                    : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm">{{ t(item.titleKey) }}</span>
                  <svg
                    @click.stop="confirmingUnstar = confirmingUnstar === item.id ? null : item.id"
                    class="w-4 h-4 text-yellow-500 fill-current cursor-pointer"
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
                <div v-if="confirmingUnstar === item.id" class="mt-1 flex justify-end space-x-1">
                  <button
                    @click.stop="toggleStar(item.menuId, item.id); confirmingUnstar = null"
                    class="text-xs text-red-500 hover:underline"
                  >
                    确认取消收藏
                  </button>
                  <button
                    @click.stop="confirmingUnstar = null"
                    class="text-xs text-gray-500 hover:underline"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏菜单 -->
        <div class="flex-1 overflow-y-auto">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {{ t('common.toolbox') }}
          </div>
          <nav class="px-4 py-2 space-y-2">
            <!-- 遍历过滤后的菜单项 -->
            <div v-for="menu in filteredMenuItems" :key="menu.id" class="space-y-1">
              <!-- 一级菜单项 -->
              <div
                @click="toggleMenu(menu.id)"
                class="flex items-center justify-between p-2 rounded-lg cursor-pointer text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <span>{{ t(menu.titleKey) }}</span>
                <svg
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': menu.isOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              
              <!-- 二级菜单项 -->
              <div
                v-show="menu.isOpen"
                class="ml-4 space-y-1"
              >
                <div
                  v-for="child in menu.children"
                  :key="child.id"
                  @click="selectPage(child.id)"
                  class="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all"
                  :class="[
                    currentPage === child.id
                      ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-white font-medium'
                      : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  ]"
                >
                  <div class="flex items-center">
                    <component
                      :is="icons[`${child.icon}Icon`]"
                      class="w-5 h-5 text-gray-600 dark:text-gray-300"
                    />
                    <span class="ml-1 text-sm">{{ t(child.titleKey) }}</span>
                  </div>
                  <svg
                    @click.stop="toggleStar(menu.id, child.id)"
                    class="w-4 h-4"
                    :class="child.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400 dark:text-gray-500'"
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
            </div>
          </nav>
        </div>

        <!-- 广告区域 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 relative">
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center relative">
            <Adsense
              adStyle="max-height: 150px; width: 100%;"
              slotId="1547745371"
              format="auto"
              fullWidthResponsive="true"
            />
          </div>
        </div>

        <!-- 底部语言切换按钮 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="relative">
            <button
              @click="isLocaleMenuOpen = !isLocaleMenuOpen"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                     text-gray-800 dark:text-white border border-transparent transition-all focus:outline-none"
            >
              <div class="flex items-center">
                <span class="w-6 h-6 flex items-center justify-center">
                  {{ LOCALES.find(l => l.code === locale)?.emoji }}
                </span>
              </div>
            </button>
            
            <!-- 语言选择下拉菜单 -->
            <div
              v-if="isLocaleMenuOpen"
              class="absolute bottom-full left-0 mb-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
            >
              <div class="py-1">
                <a
                  v-for="lang in LOCALES"
                  :key="lang.code"
                  @click="changeLocale(lang.code); isLocaleMenuOpen = false"
                  class="block px-4 py-2 text-sm cursor-pointer"
                  :class="[
                    locale === lang.code 
                      ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  ]"
                >
                  <span class="mr-2">{{ lang.emoji }}</span>
                  <span>{{ lang.name }}</span>
                </a>
              </div>
            </div>
          </div>
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
      <!-- 当边栏收起时顶部按钮 -->
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

      <!-- 动态组件于切换页面 -->
      <component 
        v-if="getCurrentComponent"
        :is="getCurrentComponent"
        class="h-full"
      />
    </div>

    <!-- 遮罩层 - 仅在移动端且边栏开时显示 -->
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

/* 添加过渡动画 */
.rotate-180 {
  transform: rotate(180deg);
}

/* 搜索框自动填充样式修复 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  -webkit-text-fill-color: inherit;
  transition: background-color 5000s ease-in-out 0s;
}

.dark input:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px rgb(55 65 81) inset;
}

/* 星标图标动画 */
.text-yellow-500 {
  transition: color 0.2s ease;
}
</style>
