<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <!-- 页面标题 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ t('about.title') }}</h1>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-6 mx-auto max-w-5xl space-y-8">
        <!-- 项目介绍卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('about.projectInfo.title') }}
          </h2>
          <div class="prose dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ t('about.projectInfo.description') }}
            </p>
            <div class="mt-4">
              <a
                href="https://github.com/kingcos/moretools"
                target="_blank"
                class="inline-flex items-center space-x-2 text-indigo-500 hover:text-indigo-600 
                       dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span class="font-medium">{{ t('about.projectInfo.github') }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 工具列表 -->
        <div class="space-y-8">
          <div 
            v-for="menu in menuItems" 
            :key="menu.id"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ t(menu.titleKey) }}
            </h2>
            <!-- 工具网格 -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="tool in menu.children"
                :key="tool.id"
                @click="selectPage(tool.id)"
                class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
                       hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50
                       transition-all duration-200 cursor-pointer group"
              >
                <div class="flex flex-col items-center text-center space-y-2">
                  <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 
                              rounded-xl flex items-center justify-center
                              group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 
                              transition-colors">
                    <component
                      :is="icons[tool.icon]"
                      class="w-6 h-6 text-indigo-500 dark:text-indigo-400"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white text-sm">
                      {{ t(`about.tools.${tool.id}.title`) }}
                    </h3>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                      {{ t(`about.tools.${tool.id}.description`) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDisplayMode } from '../composables/useDisplayMode'
import menuConfig from '../config/menu.json'
import { icons, type IconName } from '../config/icons'

const { t } = useI18n()
const { isCompactMode: _isCompactMode } = useDisplayMode()

// 确保 tool.icon 的类型正确
const menuItems = menuConfig.menuItems.map(item => ({
  ...item,
  children: item.children.map(child => ({
    ...child,
    icon: child.icon as IconName
  }))
}))

const selectPage = (pageId: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('page', pageId)
  window.location.href = url.toString()
}
</script> 