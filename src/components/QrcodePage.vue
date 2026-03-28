<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('qrcode.title') }}</h1>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-4 mx-auto space-y-4" :class="{ 'max-w-4xl': isCompactMode }">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <ElTabs v-model="currentTab" class="dark-mode-tabs" type="border-card">
            <ElTabPane
              v-for="tab in tabs"
              :key="tab.key"
              :label="t(tab.title)"
              :name="tab.key"
            />
          </ElTabs>

          <div v-if="currentTab === 'encode'" class="p-6 space-y-4">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <textarea
                  v-model="inputText"
                  class="w-full h-40 p-2 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-0 focus:border-gray-300 
                         dark:focus:border-gray-600"
                  :placeholder="t('qrcode.placeholder')"
                />
                <div class="mt-4 flex justify-between items-center">
                  <div class="flex items-center">
                    <button
                      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                             text-white rounded-lg transition-colors focus:outline-none"
                      @click="generateQRCode"
                    >{{ t('qrcode.save') }}</button>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="flex items-center">
                      <div v-if="inputText && confirmingAction === 'reset'" class="flex items-center space-x-2">
                        <button
                          class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                                 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                          @click="handleConfirm(-1, 'reset')"
                        >{{ t('qrcode.confirmReset') }}</button>
                        <button
                          class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                                 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          @click="cancelAction"
                        >{{ t('qrcode.cancel') }}</button>
                      </div>
                      <button
                        v-else-if="inputText"
                        class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none"
                        :class="[
                          confirmingAction === 'reset'
                            ? 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400'
                            : 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400'
                        ]"
                        @click="confirmingAction = 'reset'"
                      >{{ t('qrcode.reset') }}</button>
                    </div>

                    <button
                      class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
                      :class="[
                        instantMode 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      ]"
                      @click="toggleInstantMode"
                    >
                      <div class="flex items-center space-x-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span class="text-sm">{{ t('qrcode.incognito') }}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div class="w-full md:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col items-center">
                <QrcodeVue
                  ref="qrcodeRef"
                  :value="qrcodeText || ' '"
                  :size="200"
                  level="H"
                  render-as="svg"
                  :background="isDarkMode ? '#1f2937' : '#ffffff'"
                  :foreground="isDarkMode ? '#ffffff' : '#000000'"
                  class="mb-4"
                />
                <button
                  class="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                         dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg 
                         transition-colors focus:outline-none"
                  @click="downloadQRCode"
                >{{ t('qrcode.download') }}</button>
              </div>
            </div>

            <div v-if="history.length > 0 && !instantMode" class="space-y-4">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('qrcode.history') }}</h2>
                <div class="flex items-center gap-2">
                  <div v-if="confirmingAction === 'clear'" class="flex items-center space-x-2">
                    <button
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                      @click="clearHistory"
                    >{{ t('qrcode.confirmClear') }}</button>
                    <button
                      class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                             bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      @click="cancelAction"
                    >{{ t('qrcode.cancel') }}</button>
                  </div>
                  <button
                    v-else
                    class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none"
                    :class="[
                      confirmingAction === 'clear'
                        ? 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400'
                        : 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400'
                    ]"
                    @click="confirmingAction = 'clear'"
                  >{{ t('qrcode.clearAll') }}</button>

                  <button
                    class="px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
                    :class="[
                      largeMode
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    ]"
                    @click="toggleLargeMode"
                  >
                    <div class="flex items-center space-x-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      <span class="text-sm">{{ t('qrcode.zoom') }}</span>
                    </div>
                  </button>
                </div>
              </div>
              
              <div class="space-y-2 transition-all duration-300">
                <div
                  v-for="(item, index) in displayedHistory"
                  :key="index"
                  class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center gap-4"
                >
                  <div class="flex-shrink-0">
                    <QrcodeVue
                      :value="item.text"
                      :size="largeMode ? 180 : 60"
                      level="H"
                      render-as="svg"
                      :background="isDarkMode ? '#1f2937' : '#ffffff'"
                      :foreground="isDarkMode ? '#ffffff' : '#000000'"
                    />
                  </div>
                  <div class="flex-grow min-w-0">
                    <p class="text-gray-900 dark:text-white text-left break-all line-clamp-2">{{ item.text }}</p>
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2 mt-1">
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="flex-shrink-0">{{ formatDate(item.timestamp) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button
                      class="p-2 rounded-lg transition-colors focus:outline-none
                             bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      :title="t('qrcode.copyTitle')"
                      @click="copyText(item.text)"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <div v-if="confirmingAction === `delete-${index}`" class="flex items-center space-x-2">
                      <button
                        class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                               bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                        @click="handleConfirm(index, 'delete')"
                      >{{ t('qrcode.confirmDelete') }}</button>
                      <button
                        class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                               bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        @click="cancelAction"
                      >{{ t('qrcode.cancel') }}</button>
                    </div>
                    <button
                      v-else
                      class="p-2 rounded-lg transition-colors focus:outline-none"
                      :class="[
                        confirmingAction === `delete-${index}`
                          ? 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400'
                          : 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400'
                      ]"
                      :title="t('qrcode.deleteTitle')"
                      @click="confirmingAction = `delete-${index}`"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button
                  v-if="history.length > 3"
                  class="w-full py-2 mt-2 text-sm rounded-lg transition-colors focus:outline-none
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                         text-gray-800 dark:text-white"
                  @click="showAll = !showAll"
                >
                  {{ showAll 
                      ? t('qrcode.showLess') 
                      : t('qrcode.showMore', { count: history.length - 3 }) 
                  }}
                </button>
              </div>
            </div>
          </div>

          <div v-else class="p-6">
            <div class="space-y-4">
              <div 
                class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileSelect"
                />
                <button
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                         text-white rounded-lg transition-colors focus:outline-none"
                  @click="$refs.fileInput.click()"
                >{{ t('qrcode.selectImage') }}</button>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {{ t('qrcode.dragTip') }}
                </p>
              </div>

              <div v-if="decodedText" class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t('qrcode.decodedResult') }}
                  </label>
                  <button
                    class="px-4 py-2 text-sm rounded-lg transition-colors focus:outline-none
                           bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                           text-gray-600 dark:text-gray-300"
                    @click="copyDecodedText"
                  >{{ t('qrcode.copy') }}</button>
                </div>
                <textarea
                  v-model="decodedText"
                  readonly
                  class="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <ToolAd page="qrcode" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElTabs, ElTabPane } from 'element-plus'
import { useDark } from '@vueuse/core'
import QrScanner from 'qr-scanner'
import { useDisplayMode } from '../composables/useDisplayMode'
import { safeGetJSON, safeSetJSON } from '../utils/storage'
import { addToHistory, removeFromHistory, type QrHistoryItem } from '../utils/qrHistory'
import ToolAd from './ToolAd.vue'

const { t } = useI18n()
const inputText = ref('')
const qrcodeText = ref('')
const history = ref<QrHistoryItem[]>([])
const qrcodeRef = ref()
const showAll = ref(false)
const confirmingAction = ref<string | null>(null)
const instantMode = ref(false)
const currentTab = ref('encode')
const decodedText = ref('')
const fileInput = ref<HTMLInputElement>()
const { isCompactMode } = useDisplayMode()

const tabs = [
  { key: 'encode', title: 'qrcode.encodeTab' },
  { key: 'decode', title: 'qrcode.decodeTab' }
]

// 检测暗黑模式
const isDarkMode = useDark()

// 从本地存储加载历史记录（安全解析，防止损坏数据导致崩溃）
onMounted(() => {
  history.value = safeGetJSON<QrHistoryItem[]>('qrcode-history', [])
})

// 生成二维码
const generateQRCode = () => {
  if (!inputText.value) return
  qrcodeText.value = inputText.value
  if (!instantMode.value) {
    saveToHistory()
  }
}

// 置输入
const resetInput = () => {
  inputText.value = ''
  qrcodeText.value = ''
}

// 删除历史记录
const deleteHistory = (index: number) => {
  history.value = removeFromHistory(history.value, index)
  safeSetJSON('qrcode-history', history.value)
}

// 保存历史记录（去重 + 置顶 + 限制数量）
const saveToHistory = () => {
  if (!inputText.value) return
  history.value = addToHistory(history.value, inputText.value)
  safeSetJSON('qrcode-history', history.value)
}

// 修改下载二维码图片函数
const downloadQRCode = () => {
  if (!qrcodeRef.value) return
  
  try {
    // 获取 SVG 元素
    const svg = qrcodeRef.value.$el
    if (!svg) {
      throw new Error('SVG element not found')
    }
    
    // 创建 Canvas 元素
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('无法创建 canvas context')
    }
    
    // 设置 canvas 尺寸
    canvas.width = 200
    canvas.height = 200
    
    // 创建图片对象
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      // 绘制图片到 canvas
      ctx.fillStyle = isDarkMode.value ? '#1f2937' : '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      // 转换为 PNG 并下载
      const pngUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = pngUrl
      link.click()
      
      // 清理资源
      URL.revokeObjectURL(url)
    }
    
    img.src = url
  } catch {
    ElMessage.error(t('qrcode.downloadError'))
  }
}

// 添加日期格式化函数
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 计算显示的历史记录
const displayedHistory = computed(() => {
  return showAll.value ? history.value : history.value.slice(0, 3)
})

// 处理确认操作
const handleConfirm = (index: number, action: 'delete' | 'reset') => {
  if (action === 'delete') {
    deleteHistory(index)
  } else if (action === 'reset') {
    resetInput()
  }
  confirmingAction.value = null
}

// 取消操作
const cancelAction = () => {
  confirmingAction.value = null
}

// 清空历史记录
const clearHistory = () => {
  history.value = []
  safeSetJSON('qrcode-history', [])
  confirmingAction.value = null
}

// 添加复制功能
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage({
      message: t('qrcode.copySuccess'),
      type: 'success',
      duration: 2000
    })
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage({
      message: t('qrcode.copyFailed'),
      type: 'error',
      duration: 2000
    })
  }
}

// 切换痕模式
const toggleInstantMode = () => {
  instantMode.value = !instantMode.value
}

// 处理文件选择
const handleFileSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    const result = await QrScanner.scanImage(file)
    decodedText.value = result
  } catch {
    ElMessage.error(t('qrcode.decodeError'))
  }
}

// 复制解析结果
const copyDecodedText = async () => {
  try {
    await navigator.clipboard.writeText(decodedText.value)
    ElMessage({
      message: t('qrcode.copySuccess'),
      type: 'success',
      duration: 2000
    })
  } catch {
    ElMessage({
      message: t('qrcode.copyFailed'),
      type: 'error',
      duration: 2000
    })
  }
}

// 添加大模式状态
const largeMode = ref(false)

// 添加切换放大模式函数
const toggleLargeMode = () => {
  largeMode.value = !largeMode.value
}

// 添加拖拽处理函数
const handleDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (!file || !file.type.startsWith('image/')) {
    ElMessage.error(t('qrcode.invalidImageFile'))
    return
  }

  try {
    const result = await QrScanner.scanImage(file)
    decodedText.value = result
  } catch {
    ElMessage.error(t('qrcode.decodeError'))
  }
}
</script>

<style scoped>
button:focus {
  outline: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.group:hover .group-hover\:block {
  display: block;
  opacity: 1;
}

.group-hover\:block {
  transition: all 0.3s ease-in-out;
}

.break-all {
  word-break: break-all;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

.fade-transition {
  transition: all 0.3s ease-in-out;
}

.space-y-4 {
  transition: min-height 0.3s ease-in-out;
}

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

  /* Tab 样式 */
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

      /* 活动状态下的部指示条 */
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
