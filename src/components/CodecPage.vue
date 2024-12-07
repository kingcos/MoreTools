<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('codec.title') }}</h1>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-4 mx-auto space-y-4" :class="{ 'max-w-4xl': isCompactMode }">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <!-- 使用 Element Plus 的 Tabs 组件 -->
          <el-tabs v-model="currentTab" class="dark-mode-tabs" type="border-card">
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.key"
              :label="t(tab.title)"
              :name="tab.key"
            />
          </el-tabs>

          <!-- 输入输出区域 -->
          <div class="p-6 space-y-6">
            <!-- 输入框标签和文本框 -->
            <div class="space-y-2">
              <div class="flex items-center">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('codec.inputLabel') }}
                </label>
              </div>
              <textarea
                v-model="inputText"
                class="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-0 focus:border-gray-300 
                       dark:focus:border-gray-600"
                :placeholder="t('codec.input')"
              ></textarea>
            </div>

            <!-- 输出框标签和文本框 -->
            <div class="space-y-2">
              <div class="flex items-center">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('codec.outputLabel') }}
                </label>
              </div>
              <textarea
                v-model="outputText"
                class="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-0 focus:border-gray-300 
                       dark:focus:border-gray-600"
                readonly
                :placeholder="t('codec.output')"
              ></textarea>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-between items-center pt-2">
              <div class="space-x-2">
                <button
                  @click="handleEncode"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                         text-white rounded-lg transition-colors focus:outline-none"
                >{{ t('codec.encode') }}</button>
                <button
                  @click="handleDecode"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 
                         text-white rounded-lg transition-colors focus:outline-none"
                >{{ t('codec.decode') }}</button>
              </div>

              <div class="space-x-2">
                <button
                  v-if="inputText"
                  @click="copyText"
                  class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                         text-gray-600 dark:text-gray-300"
                >{{ t('codec.copy') }}</button>

                <div v-if="inputText" class="inline-block">
                  <div v-if="confirmingClear" class="flex items-center space-x-2">
                    <button
                      @click="handleReset"
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                    >{{ t('codec.confirmReset') }}</button>
                    <button
                      @click="confirmingClear = false"
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    >{{ t('codec.cancel') }}</button>
                  </div>
                  <button
                    v-else
                    @click="confirmingClear = true"
                    class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none"
                    :class="[
                      confirmingClear
                        ? 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400'
                        : 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400'
                    ]"
                  >{{ t('codec.reset') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 广告区域 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 relative">
          <Adsense
            adStyle="max-height: 150px; width: 100%;"
            slotId="2839839840"
            format="auto"
            fullWidthResponsive="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElTabs, ElTabPane } from 'element-plus'
import 'element-plus/dist/index.css'
import Adsense from './Adsense.vue'
import { useDisplayMode } from '../composables/useDisplayMode'

const { t } = useI18n()
const inputText = ref('')
const outputText = ref('')
const currentTab = ref('url')
const confirmingClear = ref(false)
const { isCompactMode } = useDisplayMode()

const tabs = [
  { key: 'url', title: 'codec.url' },
  { key: 'base64', title: 'codec.base64' }
]

// 编码处理
const handleEncode = () => {
  if (!inputText.value) return
  try {
    outputText.value = currentTab.value === 'url' 
      ? encodeURIComponent(inputText.value)
      : btoa(inputText.value)
  } catch (err) {
    ElMessage.error(String(err))
  }
}

// 解码处理
const handleDecode = () => {
  if (!inputText.value) return
  try {
    outputText.value = currentTab.value === 'url'
      ? decodeURIComponent(inputText.value)
      : atob(inputText.value)
  } catch (err) {
    ElMessage.error(String(err))
  }
}

// 复制文本
const copyText = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage({
      message: t('codec.copySuccess'),
      type: 'success',
      duration: 2000
    })
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage({
      message: t('codec.copyFailed'),
      type: 'error',
      duration: 2000
    })
  }
}

// 清空输入
const handleReset = () => {
  inputText.value = ''
  outputText.value = ''
  confirmingClear.value = false
}
</script>

<style scoped>
/* Tabs 样式优化 */
:deep(.dark-mode-tabs.el-tabs) {
  /* 移除默认边框 */
  &.el-tabs--border-card {
    background: transparent;
    border: none;
  }

  .el-tabs__header {
    background: transparent;
    border: none;
    margin: 0;
  }

  .el-tabs__nav {
    border: none !important;
  }

  /* Tab 项样式 */
  .el-tabs__item {
    height: 48px;
    line-height: 48px;
    padding: 0 24px;
    font-size: 14px;
    color: rgba(75, 85, 99, 0.7);
    transition: all 0.3s ease;
    border: none;
    margin-right: 0;
    position: relative;
    
    &:hover {
      color: var(--el-color-primary);
    }
    
    &.is-active {
      color: var(--el-color-primary);
      background: transparent;

      /* 活动状态下的底部指示条 */
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--el-color-primary);
      }
    }
  }

  /* 内容区域样式 */
  .el-tabs__content {
    padding: 0;
  }
}

/* 暗黑模式特定样式 */
:deep(.dark .dark-mode-tabs.el-tabs) {
  .el-tabs__item {
    color: rgba(255, 255, 255, 0.7);
    
    &:hover {
      color: var(--el-color-primary);
    }
    
    &.is-active {
      color: var(--el-color-primary);
    }
  }
}
</style>